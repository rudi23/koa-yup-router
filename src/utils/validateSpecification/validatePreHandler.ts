import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    Handler,
    RouteConfig,
    DefaultContext,
    DefaultState,
} from '../../types';
import isHandlerSupportedFunction from './isHandlerSupportedFunction';

export default function validatePreHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
>(
    preHandler: RouteConfig<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>['preHandler']
): Handler<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>[] {
    if (!preHandler) {
        return [];
    }

    return [preHandler]
        .flat(Infinity)
        .map((fn) => isHandlerSupportedFunction<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(fn));
}
