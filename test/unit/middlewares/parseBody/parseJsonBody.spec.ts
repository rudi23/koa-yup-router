import type * as Koa from 'koa';
import { json } from 'co-body';
import { valueOfType } from '../../../utils';
import createParseJsonBody from '@src/middlewares/parseBody/parseJsonBody';

jest.mock('co-body', () => ({
    json: jest.fn().mockImplementation(() => Promise.resolve({ res: 'parsed body' })),
}));

const mockParseJson = json as jest.Mock;
const next = jest.fn();

describe('middleware/parseBody/parseJsonBody', () => {
    it('should throw error when request is not json', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => false,
            },
        });

        await expect(createParseJsonBody({})(context, next)).rejects.toThrow('JSON body expected');
    });

    it('should not parse body if ctx.request.body already exists', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
                body: { foo: 'bar' },
            },
        });

        await createParseJsonBody({})(context, next);

        expect(context.request.body).toEqual({ foo: 'bar' });
    });

    it('should parse json body and not call next()', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseJsonBody({})(context, next);

        expect(context.request.body).toEqual({ res: 'parsed body' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should parse json body with options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseJsonBody({ limit: 5, strict: true })(context, next);

        expect(mockParseJson).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                    body: { res: 'parsed body' },
                },
            },
            { limit: 5, strict: true },
        );
    });

    it('should parse json body with default options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseJsonBody()(context, next);

        expect(mockParseJson).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                    body: { res: 'parsed body' },
                },
            },
            {},
        );
    });
});
