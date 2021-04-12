import type { DefaultBody, DefaultHeaders, DefaultParams, DefaultQuery, Handler } from '../../@types';

export default function isHandlerSupportedFunction<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(handler: Handler<ParamsT, QueryT, BodyT, HeadersT>): Handler<ParamsT, QueryT, BodyT, HeadersT> {
    if (typeof handler !== 'function') {
        throw new Error('Route handler must be a function');
    }

    return handler;
}
