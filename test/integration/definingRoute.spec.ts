import Koa from 'koa';
import supertest from 'supertest';
import type { TypeOf } from 'yup';
import type { Middleware, RouterContext } from '../../src/types/index.js';
import YupRouter from '../../src/index.js';
import { paramsSchema, querySchema, bodySchema, headersSchema } from './schema.js';

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
            expect(response.body.id1).toBe(1);
            expect(response.body.id2).toBe(1);
            expect(response.body.search1).toBe('foo');
            expect(response.body.search2).toBe('foo');
            expect(response.body.custom1).toBe('value');
            expect(response.body.custom2).toBe('value');
            expect(response.body.custom3).toBe('value');
            expect(response.body.custom4).toBe('value');
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
        const koaMiddleware: Koa.Middleware = async (_ctx, next) => {
            await next();
        };

        const handler: Middleware<ParamsT, QueryT, BodyT, HeadersT> = (ctx) => {
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
            handler: [koaMiddleware, handler],
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with handler separately defined with RouterContext', async () => {
        const koaMiddleware: Koa.Middleware = async (_ctx, next) => {
            await next();
        };

        const handler = (ctx: RouterContext<ParamsT, QueryT, BodyT, HeadersT>) => {
            ctx.body = {
                id1: ctx.request.params.id,
                id2: ctx.params.id,
                search1: ctx.request.query.search,
                search2: ctx.query.search,
                string: ctx.request.body.string,
                body: ctx.request.body,
                custom1: ctx.request.headers.custom,
                custom2: ctx.headers.custom,
                custom3: ctx.request.header.custom,
                custom4: ctx.header.custom,
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
            handler: [koaMiddleware, handler],
        });

        app.use(router.middleware());

        await expectValidEndpointRequest(request);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should add route with generic type declaration', async () => {
        const router = new YupRouter();

        const koaMiddleware: Koa.Middleware = async (_ctx, next) => {
            await next();
        };

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
            handler: [
                koaMiddleware,
                (ctx) => {
                    ctx.body = {
                        id1: ctx.request.params.id,
                        id2: ctx.params.id,
                        search1: ctx.request.query.search,
                        search2: ctx.query.search,
                        string: ctx.request.body.string,
                        body: ctx.request.body,
                        custom1: ctx.request.headers.custom,
                        custom2: ctx.headers.custom,
                        custom3: ctx.request.header.custom,
                        custom4: ctx.header.custom,
                    };
                },
            ],
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
                    id1: ctx.request.params.id,
                    id2: ctx.params.id,
                    search1: ctx.request.query.search,
                    search2: ctx.query.search,
                    string: ctx.request.body.string,
                    body: ctx.request.body,
                    custom1: ctx.request.headers.custom,
                    custom2: ctx.headers.custom,
                    custom3: ctx.request.header.custom,
                    custom4: ctx.header.custom,
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
                    id1: ctx.request.params.id,
                    id2: ctx.params.id,
                    search1: ctx.request.query.search,
                    search2: ctx.query.search,
                    string: ctx.request.body.string,
                    body: ctx.request.body,
                    custom1: ctx.request.headers.custom,
                    custom2: ctx.headers.custom,
                    custom3: ctx.request.header.custom,
                    custom4: ctx.header.custom,
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

    // eslint-disable-next-line jest/expect-expect
    it('should allow to use custom state and context', async () => {
        const router = new YupRouter();

        type StateT = {
            foo: string;
        };
        type ContextT = {
            bar: string;
        };

        router.addRoute<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>({
            method: 'get',
            path: '/path/:id',
            validate: {
                type: 'json',
                body: bodySchema,
                params: paramsSchema,
                query: querySchema,
                headers: headersSchema,
            },
            handler: (ctx) => {
                ctx.bar = 'bar';
                ctx.state = { foo: 'foo' };

                ctx.body = {
                    state: ctx.state.foo,
                    context: ctx.bar,
                };
            },
        });

        app.use(router.middleware());

        await request
            .get('/path/1?search=foo')
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
                expect(response.body.state).toBe('foo');
                expect(response.body.context).toBe('bar');
            });
    });
});
