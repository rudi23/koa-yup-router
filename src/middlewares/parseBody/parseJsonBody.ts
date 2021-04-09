import { json } from 'co-body';
import type Koa from 'koa';
import type { JsonBodyOptions } from '../../@types';

export default function createParseJsonBody(options: JsonBodyOptions = {}): Koa.Middleware {
    return async function parseJsonBody(ctx: Koa.Context): Promise<void> {
        if (!ctx.request.is('json')) {
            throw new Error('JSON body expected');
        }
        ctx.request.body = ctx.request.body || (await json(ctx, options));
    };
}
