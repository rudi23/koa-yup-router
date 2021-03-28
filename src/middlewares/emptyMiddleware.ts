import type Koa from 'koa';

export default async function emptyMiddleware(ctx: Koa.Context, next: Koa.Next): Promise<void> {
    await next();
}
