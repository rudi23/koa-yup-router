import clone from 'clone';
import type Koa from 'koa';
import type { DefaultBody, DefaultHeaders, DefaultParams, DefaultQuery, RouteSpecification } from '../@types';

export default function createExposeSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteSpecification<ParamsT, QueryT, BodyT, HeadersT>): Koa.Middleware {
    return async function exposeSpecification(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        ctx.state.route = clone(spec);

        await next();
    };
}
