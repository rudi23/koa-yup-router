import type Koa from 'koa';
import type { ObjectSchema } from 'yup';
import * as yup from 'yup';
import captureError from '../utils/captureError';
import { inputParts } from '../types/constants';
import type {
    DefaultBody,
    DefaultContext,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    DefaultState,
    RouteSpecification,
    ValidationType,
} from '../types';

function updateRequestWithCastedValues(ctx: Koa.Context, inputPart: ValidationType, validationResult: any) {
    switch (inputPart) {
        case 'headers':
        case 'query':
            // setting ctx.request.header, ctx.request.query directly causes casting back to strings
            Object.keys(validationResult).forEach((key) => {
                ctx.request[inputPart][key] = validationResult[key];
            });
            break;
        case 'params':
            // setting ctx.params directly causes casting back to strings
            Object.keys(validationResult).forEach((key) => {
                ctx.params[key] = validationResult[key];
            });
            break;
        case 'body':
            // setting ctx.request.body directly causes casting back to strings
            Object.keys(validationResult).forEach((key) => {
                (ctx.request.body as any)[key] = validationResult[key];
            });
            break;
        default:
            throw new Error('Unknown input part');
    }
}

function validateInput(ctx: Koa.Context, inputPart: ValidationType, schema: ObjectSchema<any>): void {
    const data = inputPart === 'params' ? ctx.params : ctx.request[inputPart];

    const validationResult = schema.validateSync(data, {
        abortEarly: false,
        recursive: true,
        strict: false,
        stripUnknown: false,
    });

    updateRequestWithCastedValues(ctx, inputPart, validationResult);
}

export default function createValidate<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
>(spec: RouteSpecification<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>): Koa.Middleware {
    return async function validate(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        inputParts.forEach((inputPart) => {
            const schema = spec.validate?.[inputPart];
            if (schema === undefined) {
                return;
            }

            try {
                validateInput(ctx, inputPart, schema);
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    captureError(ctx, inputPart, err);
                } else {
                    throw err;
                }
            }
        });

        await next();
    };
}
