import type Koa from 'koa';
import * as yup from 'yup';
import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    InputType,
    RouteSpecification,
    ValidateConfig,
} from '../../@types';
import captureError from '../../utils/captureError';
import emptyMiddleware from '../emptyMiddleware';
import parseFormBody from './parseFormBody';
import parseMultipartBody from './parseMultipartBody';
import parseJsonBody from './parseJsonBody';

function resolveBodyParser(type: InputType, validateSpec: ValidateConfig) {
    switch (type) {
        case 'json':
            return parseJsonBody(validateSpec.jsonOptions);
        case 'form':
            return parseFormBody(validateSpec.formOptions);
        case 'stream':
        case 'multipart':
            return parseMultipartBody(validateSpec.multipartOptions);
        default:
            throw new Error(`Unsupported body type specified: ${validateSpec.type}`);
    }
}

export default function createParseBody<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteSpecification<ParamsT, QueryT, BodyT, HeadersT>): Koa.Middleware {
    if (!spec.validate?.type) {
        return emptyMiddleware;
    }

    const parseBody = resolveBodyParser(spec.validate.type, spec.validate);

    return async function parseBodyWithErrorHandler(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        try {
            await parseBody(ctx, next);
        } catch (err) {
            captureError(ctx, 'type', new yup.ValidationError(err.message));
        }

        await next();
    };
}
