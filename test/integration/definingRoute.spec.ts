import Koa from 'koa';
import supertest from 'supertest';
import type { TypeOf } from 'yup';
import { paramsSchema, querySchema, bodySchema, headersSchema } from './schema';
import YupRouter from '@src/index';
import type { RouterMiddleware, RouterContext } from '@src/@types';

type ParamsT = TypeOf<typeof paramsSchema>;
type QueryT = TypeOf<typeof querySchema>;
type BodyT = TypeOf<typeof bodySchema>;
type HeadersT = TypeOf<typeof headersSchema>;

let app = new Koa();
let request = supertest(app.callback());

const expectValidEndpointRequest = async (req: supertest.SuperTest<supertest.Test>) =>
    req
        .post('/path/1?search=foo')
        .set('Custom', 'value')
        .send({
            string: 'string',
            number: 100,
            object: {
                bool: false,
            },
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.params).toEqual({ id: 1 });
            expect(response.body.query).toEqual({ search: 'foo' });
            expect(response.body.headers.custom).toEqual('value');
            expect(response.body.body).toEqual({
                string: 'string',
                number: 100,
                object: {
                    bool: false,
                },
            });
        });

describe('defining route', () => {
    beforeEach(async () => {
        app = new Koa();
        request = supertest(app.callback());
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with handler separately defined as RouterMiddleware', async () => {
        const handler: RouterMiddleware<ParamsT, QueryT, BodyT, HeadersT> = (ctx) => {
            ctx.body = {
                params: ctx.params,
                query: ctx.request.query,
                body: ctx.request.body,
                headers: ctx.request.headers,
            };
        };

        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path/:id',
            validate: {
                type: 'json',
                body: bodySchema,
                params: paramsSchema,
                query: querySchema,
                headers: headersSchema,
            },
            handler,
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with handler separately defined with RouterContext', async () => {
        function handler(ctx: RouterContext<ParamsT, QueryT, BodyT, HeadersT>) {
            ctx.body = {
                params: ctx.params,
                query: ctx.request.query,
                body: ctx.request.body,
                headers: ctx.request.headers,
            };
        }

        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path/:id',
            validate: {
                type: 'json',
                body: bodySchema,
                params: paramsSchema,
                query: querySchema,
                headers: headersSchema,
            },
            handler,
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with generic type declaration', async () => {
        const router = new YupRouter();

        router.addRoute<ParamsT, QueryT, BodyT, HeadersT>({
            method: 'post',
            path: '/path/:id',
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

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route without generic type declaration', async () => {
        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path/:id',
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

        await expectValidEndpointRequest(request);
    });
});
