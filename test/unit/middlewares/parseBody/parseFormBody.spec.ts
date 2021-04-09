import type * as Koa from 'koa';
import { form } from 'co-body';
import { valueOfType } from '../../../utils';
import createParseFormBody from '@src/middlewares/parseBody/parseFormBody';

jest.mock('co-body', () => ({
    form: jest.fn().mockImplementation(() => Promise.resolve('parsed body')),
}));

const mockParseForm = form as jest.Mock;
const next = jest.fn();

describe('middleware/parseBody/parseFormBody', () => {
    it('should throw error when request is not urlencoded', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => false,
            },
        });

        await expect(createParseFormBody({})(context, next)).rejects.toThrow(
            'x-www-form-urlencoded body expected',
        );
    });

    it('should not parse body if ctx.request.body already exists', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
                body: 'body',
            },
        });

        await createParseFormBody({})(context, next);

        expect(context.request.body).toBe('body');
    });

    it('should parse form body and not call next()', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseFormBody({})(context, next);

        expect(context.request.body).toBe('parsed body');
        expect(next).not.toHaveBeenCalled();
    });

    it('should parse form body with options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseFormBody({ limit: 5, strict: true })(context, next);

        expect(mockParseForm).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                    body: 'parsed body',
                },
            },
            { limit: 5, strict: true },
        );
    });

    it('should parse form body with default options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseFormBody()(context, next);

        expect(mockParseForm).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                    body: 'parsed body',
                },
            },
            {},
        );
    });
});
