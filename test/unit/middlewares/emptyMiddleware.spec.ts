import type Koa from 'koa';
import { valueOfType } from '../../utils';
import emptyMiddleware from '@src/middlewares/emptyMiddleware';

const next = jest.fn();

describe('middleware/emptyMiddleware', () => {
    it('should not change context and and call next()', async () => {
        const context = valueOfType<Koa.Context>({});

        await emptyMiddleware(context, next);

        expect(context).toEqual({});
        expect(next).toHaveBeenCalled();
    });
});
