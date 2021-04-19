import type Koa from 'koa';
import { ValidationError } from 'yup';
import { valueOfType } from '../../utils';
import errorHandler from '@src/middlewares/errorHandler';

const next = jest.fn();

describe('middleware/errorHandler', () => {
    it('should call next() and not change context when ctx.invalid is undefined', async () => {
        const context = valueOfType<Koa.Context>({});

        await errorHandler(context, next);

        expect(context).toEqual({});
        expect(next).toHaveBeenCalled();
    });

    it('should call next() and not change context when ctx.invalid is empty object', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: {},
        });

        await errorHandler(context, next);

        expect(context).toEqual({
            invalid: {},
        });
        expect(next).toHaveBeenCalled();
    });

    it('should call next() and not change context when ctx.invalid is string', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: 'some unknown string',
        });

        await errorHandler(context, next);

        expect(context).toEqual({
            invalid: 'some unknown string',
        });
        expect(next).toHaveBeenCalled();
    });

    it('should call next() and prepare response', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: {
                params: new ValidationError('Params error'),
            },
        });

        await errorHandler(context, next);

        expect(context.status).toBe(400);
        expect((context.body as any).params).toBeInstanceOf(ValidationError);
        expect((context.body as any).params.message).toBe('Params error');
        expect(context.body).toEqual({
            code: 400,
            message: 'Error in request params',
            params: new ValidationError('Params error'),
        });
        expect(next).toHaveBeenCalled();
    });

    it('should omit unknown invalid properties', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: {
                params: new ValidationError('Params error'),
                unknown: new ValidationError('Unknown error'),
            },
        });

        await errorHandler(context, next);

        expect(context.body).toEqual({
            code: 400,
            message: 'Error in request params',
            params: new ValidationError('Params error'),
        });
    });

    it('should call next() and not change context when ctx.invalid has only unknown properties', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: {
                unknown: new ValidationError('Unknown error'),
            },
        });

        await errorHandler(context, next);

        expect(context).toEqual({
            invalid: {
                unknown: new ValidationError('Unknown error'),
            },
        });
        expect(next).toHaveBeenCalled();
    });
});
