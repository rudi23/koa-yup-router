import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    Middleware,
    DefaultContext,
    DefaultState,
} from '../../types';

export default function isHandlerSupportedFunction<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
>(
    handler: Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
): Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT> {
    if (typeof handler !== 'function') {
        throw new Error('Route handler must be a function');
    }

    return handler;
}
