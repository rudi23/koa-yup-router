import Koa from 'koa';
import supertest from 'supertest';
import { paramsSchema, querySchema, bodySchema, headersSchema } from './schema';
import YupRouter from '@src/index';
import type { ValidationErrors } from '@src/@types';

const app = new Koa();
const request = supertest(app.callback());

describe('custom error handler', () => {
    it('should use custom error handler', async () => {
        async function customErrorHandler(ctx: Koa.Context, next: Koa.Next): Promise<void> {
            await next();

            const invalid = ctx.invalid as ValidationErrors | undefined;
            if (invalid !== undefined) {
                ctx.status = 400;
                ctx.body = {
                    params: invalid?.params?.errors,
                    query: invalid?.query?.errors,
                    body: invalid?.body?.errors,
                    headers: invalid?.headers?.errors,
                    type: invalid?.type?.errors,
                };
            }
        }

        const router = new YupRouter({ errorHandler: customErrorHandler });

        router.addRoute({
            method: 'post',
            path: '/path',
            validate: {
                type: 'json',
                body: bodySchema,
                params: paramsSchema,
                query: querySchema,
                headers: headersSchema,
            },
            handler: (ctx) => {
                ctx.body = {
                    params: ctx.params,
                    query: ctx.request.query,
                    body: ctx.request.body,
                    headers: ctx.request.headers,
                };
            },
        });

        app.use(router.middleware());

        await request
            .post('/path')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({
                    params: ['id is a required field'],
                    query: ['search is a required field'],
                    body: [
                        'number is a required field',
                        'string is a required field',
                        'object.bool is a required field',
                    ],
                    headers: ['custom is a required field'],
                });
            });
    });
});
