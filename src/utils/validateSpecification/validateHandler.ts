import type { DefaultBody, DefaultHeaders, DefaultParams, DefaultQuery, Handler, RouteConfig } from '../../@types';
import isHandlerSupportedFunction from './isHandlerSupportedFunction';

export default function validateHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(handler: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>['handler']): Handler<ParamsT, QueryT, BodyT, HeadersT>[] {
    if (!handler) {
        throw new Error('Missing route handlers');
    }

    return [handler].flat(Infinity).map(isHandlerSupportedFunction);
}
