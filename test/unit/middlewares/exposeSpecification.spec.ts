import type Koa from 'koa';
import { valueOfType } from '../../utils.js';
import createExposeSpecification from '../../../src/middlewares/exposeSpecification.js';

const next = jest.fn();

describe('middleware/exposeSpecification', () => {
    it('should expose specification and and call next()', async () => {
        const context = valueOfType<Koa.Context>({});

        await createExposeSpecification({
            preHandlers: [],
            handlers: [],
            methods: ['get'],
            path: '/path',
            validate: {},
        })(context, next);

        expect(context.state.route).toEqual({
            preHandlers: [],
            handlers: [],
            methods: ['get'],
            path: '/path',
            validate: {},
        });
        expect(next).toHaveBeenCalled();
    });

    it('should overwrite ctx.invalid.route if it exists', async () => {
        const context = valueOfType<Koa.Context>({
            state: {
                foo: 'bar',
                route: 'some unknown value',
            },
        });

        await createExposeSpecification({
            preHandlers: [],
            handlers: [],
            methods: ['get'],
            path: '/path',
            validate: {},
        })(context, next);

        expect(context.state.foo).toBe('bar');
        expect(context.state.route).toEqual({
            preHandlers: [],
            handlers: [],
            methods: ['get'],
            path: '/path',
            validate: {},
        });
        expect(next).toHaveBeenCalled();
    });
});
