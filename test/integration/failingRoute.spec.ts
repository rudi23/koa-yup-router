import Koa from 'koa';
import supertest from 'supertest';
import YupRouter from '../../src/index.js';
import { paramsSchema, querySchema, bodySchema, headersSchema } from './schema.js';

const app = new Koa();
const request = supertest(app.callback());

describe('failing route', () => {
    it('should response with status 400 and validation error', async () => {
        const router = new YupRouter();

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
                delete response.body.headers.value.host;

                expect(response.body).toEqual({
                    body: {
                        errors: [
                            'number is a required field',
                            'string is a required field',
                            'object.bool is a required field',
                        ],
                        inner: [
                            {
                                errors: ['number is a required field'],
                                inner: [],
                                message: 'number is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'number',
                                    'spec': {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'number',
                                type: 'optionality',
                            },
                            {
                                errors: ['string is a required field'],
                                inner: [],
                                message: 'string is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'string',
                                    'spec': {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'string',
                                type: 'optionality',
                            },
                            {
                                errors: ['object.bool is a required field'],
                                inner: [],
                                message: 'object.bool is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'object.bool',
                                    'spec': {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'object.bool',
                                type: 'optionality',
                            },
                        ],
                        message: '3 errors occurred',
                        name: 'ValidationError',
                        value: {},
                    },
                    code: 400,
                    headers: {
                        errors: ['custom is a required field'],
                        inner: [
                            {
                                errors: ['custom is a required field'],
                                inner: [],
                                message: 'custom is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'custom',
                                    'spec': {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'custom',
                                type: 'optionality',
                            },
                        ],
                        message: 'custom is a required field',
                        name: 'ValidationError',
                        value: {
                            'accept-encoding': 'gzip, deflate',
                            connection: 'close',
                            'content-length': '2',
                            'content-type': 'application/json',
                        },
                    },
                    message: 'Error in request params, query, headers, body',
                    params: {
                        errors: ['id is a required field'],
                        inner: [
                            {
                                errors: ['id is a required field'],
                                inner: [],
                                message: 'id is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'id',
                                    spec: {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'id',
                                type: 'optionality',
                            },
                        ],
                        message: 'id is a required field',
                        name: 'ValidationError',
                        value: {},
                    },
                    query: {
                        errors: ['search is a required field'],
                        inner: [
                            {
                                errors: ['search is a required field'],
                                inner: [],
                                message: 'search is a required field',
                                name: 'ValidationError',
                                params: {
                                    path: 'search',
                                    spec: {
                                        abortEarly: true,
                                        coerce: true,
                                        nullable: false,
                                        optional: false,
                                        recursive: true,
                                        strict: false,
                                        strip: false,
                                    },
                                },
                                path: 'search',
                                type: 'optionality',
                            },
                        ],
                        message: 'search is a required field',
                        name: 'ValidationError',
                        value: {},
                    },
                });
            });
    });

    it('should not process handler when there is validation error', async () => {
        const handler = jest.fn();

        const router = new YupRouter();

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
            handler,
        });

        app.use(router.middleware());

        await request
            .post('/path')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
                expect(response.body.code).toBe(400);

                expect(handler).not.toHaveBeenCalled();
            });
    });
});
