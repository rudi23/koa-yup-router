import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    Handler,
    RouteConfig,
} from '../../@types';
import isHandlerSupportedFunction from './isHandlerSupportedFunction';

export default function validatePreHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(
    preHandler: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>['preHandler'],
): Handler<ParamsT, QueryT, BodyT, HeadersT>[] {
    if (!preHandler) {
        return [];
    }

    return [preHandler].flat(Infinity).map((fn) => isHandlerSupportedFunction(fn));
}
