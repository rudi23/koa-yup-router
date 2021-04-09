import { form } from 'co-body';
import type Koa from 'koa';
import type { FormBodyOptions } from '../../@types';

export default function createParseFormBody(options: FormBodyOptions = {}): Koa.Middleware {
    return async function parseFormBody(ctx: Koa.Context): Promise<void> {
        if (!ctx.request.is('urlencoded')) {
            throw new Error('x-www-form-urlencoded body expected');
        }
        ctx.request.body = ctx.request.body || (await form(ctx, options));
    };
}
