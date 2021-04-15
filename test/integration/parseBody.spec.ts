import Koa from 'koa';
import supertest from 'supertest';
import { bodySchema } from './schema';
import YupRouter from '@src/index';

let app = new Koa();
let request = supertest(app.callback());

describe('parse body', () => {
    beforeEach(async () => {
        app = new Koa();
        request = supertest(app.callback());
    });

    it('should parse json', async () => {
        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path',
            validate: {
                type: 'json',
                body: bodySchema,
            },
            handler: (ctx) => {
                ctx.body = ctx.request.body;
            },
        });

        app.use(router.middleware());

        await request
            .post('/path')
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
                expect(response.body).toEqual({
                    string: 'string',
                    number: 100,
                    object: {
                        bool: false,
                    },
                });
            });
    });

    it('should parse form', async () => {
        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path',
            validate: {
                type: 'form',
                body: bodySchema,
            },
            handler: (ctx) => {
                ctx.body = ctx.request.body;
            },
        });

        app.use(router.middleware());

        await request
            .post('/path')
            .send({
                string: 'string',
                number: 100,
                object: {
                    bool: false,
                },
            })
            .type('form')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    string: 'string',
                    number: 100,
                    object: {
                        bool: false,
                    },
                });
            });
    });

    it('should parse stream/multipart', async () => {
        const router = new YupRouter();

        router.addRoute({
            method: 'post',
            path: '/path',
            validate: {
                type: 'multipart',
            },
            handler: async (ctx) => {
                let filename;
                let part;
                // eslint-disable-next-line no-await-in-loop,no-cond-assign
                while ((part = await (ctx.request.parts as any))) {
                    filename = part.filename;
                    part.resume();
                }

                ctx.body = {
                    color: (ctx.request.parts as any).field.color,
                    file: filename,
                };
            },
        });

        app.use(router.middleware());

        await request
            .post('/path')
            .attach('file', `${__dirname}/../fixtures/koa.png`)
            .field('color', 'green')
            .type('form')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({ color: 'green', file: 'koa.png' });
            });
    });
});
