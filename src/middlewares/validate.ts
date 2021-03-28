import type Koa from 'koa';
import type * as Yup from 'yup';
import captureError from '../utils/captureError';
import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    RouteSpecification,
    ValidateConfig,
    ValidationType,
} from '../@types';

const inputParts: ValidationType[] = ['headers', 'query', 'params', 'body'];

function updateRequest(ctx: Koa.Context, inputPart: ValidationType, validationResult: any) {
    // update our request with the casted values
    switch (inputPart) {
        case 'headers': // request.header is getter only, cannot set it
        case 'query': // setting request.query directly causes casting back to strings
            Object.keys(validationResult).forEach((key) => {
                ctx.request[inputPart][key] = validationResult[key];
            });
            break;
        case 'params':
            ctx.params = validationResult;
            break;
        case 'body':
            ctx.request.body = validationResult;
            break;
        default:
            throw new Error('Unknown input part');
    }
}

function validateInput(
    ctx: Koa.Context,
    inputPart: ValidationType,
    validateSpec: ValidateConfig
): Yup.ValidationError | undefined {
    const schema = validateSpec[inputPart];
    if (!schema) {
        return undefined;
    }

    const data = inputPart === 'params' ? ctx.params : ctx.request[inputPart];

    const validationResult = schema.validateSync(data, {
        abortEarly: false,
        recursive: true,
        strict: false,
        stripUnknown: false,
    });

    updateRequest(ctx, inputPart, validationResult);

    return undefined;
}

export default function createValidate<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteSpecification<ParamsT, QueryT, BodyT, HeadersT>): Koa.Middleware {
    return async function validate(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        inputParts.forEach((inputPart) => {
            if (!spec?.validate) {
                return;
            }

            try {
                validateInput(ctx, inputPart, spec.validate);
            } catch (err) {
                captureError(ctx, inputPart, err);
            }
        });

        await next();
    };
}
