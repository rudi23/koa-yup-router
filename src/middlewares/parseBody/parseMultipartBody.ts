import busboy from 'await-busboy';
import type Koa from 'koa';
import type { MultipartBodyOptions } from '../../@types';

export default function createParseMultipartBody(options: MultipartBodyOptions = {}): Koa.Middleware {
    return async function parseMultipartBody(ctx: Koa.Context): Promise<void> {
        if (!ctx.request.is('multipart/*')) {
            throw new Error('Multipart body expected');
        }
        ctx.parts = busboy(ctx, { ...options, autoFields: true });
    };
}
