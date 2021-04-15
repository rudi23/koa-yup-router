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

const expectValidEndpointRequest = async (
    req: supertest.SuperTest<supertest.Test>,
    method: 'get' | 'post' | 'put' | 'delete' = 'post'
) =>
    req[method]('/path/1?search=foo')
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
            expect(response.body.id).toBe(1);
            expect(response.body.search).toBe('foo');
            expect(response.body.custom).toBe('value');
            expect(response.body.string).toBe('string');
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
                id: ctx.params.id,
                search: ctx.request.query.search,
                string: ctx.request.body.string,
                body: ctx.request.body,
                custom: ctx.request.headers.custom,
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
                id: ctx.params.id,
                search: ctx.request.query.search,
                string: ctx.request.body.string,
                body: ctx.request.body,
                custom: ctx.request.headers.custom,
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
                    id: ctx.params.id,
                    search: ctx.request.query.search,
                    string: ctx.request.body.string,
                    body: ctx.request.body,
                    custom: ctx.request.headers.custom,
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
                    id: ctx.params.id,
                    search: ctx.request.query.search,
                    string: (ctx.request.body as any).string,
                    body: ctx.request.body,
                    custom: ctx.request.headers.custom,
                };
            },
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with multiple methods', async () => {
        const router = new YupRouter();

        router.addRoute({
            method: ['get', 'post', 'put', 'delete'],
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
                    id: ctx.params.id,
                    search: ctx.request.query.search,
                    string: (ctx.request.body as any).string,
                    body: ctx.request.body,
                    custom: ctx.request.headers.custom,
                };
            },
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request, 'post');
        await expectValidEndpointRequest(request, 'get');
        await expectValidEndpointRequest(request, 'put');
        await expectValidEndpointRequest(request, 'delete');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should allow to use prefix and use koa router route', async () => {
        const router = new YupRouter({ prefix: '/prefix' });

        router.get('/', (ctx) => {
            ctx.body = {};
        });

        router.addRoute({
            method: 'get',
            path: '/path',
            handler: (ctx) => {
                ctx.body = {};
            },
        });

        app.use(router.middleware());

        await request.get('/prefix').expect(200);
        await request.get('/prefix/path').expect('Content-Type', /json/).expect(200);
        await request.get('/path').expect(404);
    });
});
