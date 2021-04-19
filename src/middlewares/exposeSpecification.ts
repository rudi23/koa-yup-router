import clone from 'clone';
import type Koa from 'koa';
import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    RouteSpecification,
    DefaultContext,
    DefaultState,
} from '../types';

export default function createExposeSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
>(spec: RouteSpecification<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>): Koa.Middleware {
    return async function exposeSpecification(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        ctx.state = ctx.state || {};
        ctx.state.route = clone(spec);

        await next();
    };
}
