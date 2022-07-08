import type {
    DefaultBody,
    DefaultContext,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    DefaultState,
    Middleware,
    RouteConfig,
} from '../../types';
import isHandlerSupportedFunction from './isHandlerSupportedFunction';

export default function validateHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
>(
    handler: RouteConfig<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>['handler']
): Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>[] {
    if (!handler) {
        throw new Error('Missing route handlers');
    }

    return [handler]
        .flat()
        .map((fn) => isHandlerSupportedFunction<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(fn));
}
