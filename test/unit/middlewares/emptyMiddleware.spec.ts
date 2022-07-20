import type Koa from 'koa';
import { valueOfType } from '../../utils.js';
import emptyMiddleware from '../../../src/middlewares/emptyMiddleware.js';

const next = jest.fn();

describe('middleware/emptyMiddleware', () => {
    it('should not change context and and call next()', async () => {
        const context = valueOfType<Koa.Context>({});

        await emptyMiddleware(context, next);

        expect(context).toEqual({});
        expect(next).toHaveBeenCalled();
    });
});
