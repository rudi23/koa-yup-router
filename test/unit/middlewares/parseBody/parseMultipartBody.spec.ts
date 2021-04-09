import busboy from 'await-busboy';
import type * as Koa from 'koa';
import { valueOfType } from '../../../utils';
import createParseMultipartBody from '@src/middlewares/parseBody/parseMultipartBody';

jest.mock('await-busboy');

const mockBusboy = (busboy as jest.Mock).mockImplementation(() => ({ file: 'parsed body' }));
const next = jest.fn();

describe('middleware/parseBody/parseMultipartBody', () => {
    it('should throw error when request is not multipart/*', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => false,
            },
        });

        await expect(createParseMultipartBody({})(context, next)).rejects.toThrow('Multipart body expected');
    });

    it('should parse multipart body and not call next()', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseMultipartBody({})(context, next);

        expect(context.request.parts).toEqual({ file: 'parsed body' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should parse multipart body with options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseMultipartBody({ highWaterMark: 10, preservePath: true })(context, next);

        expect(mockBusboy).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                },
            },
            { autoFields: true, highWaterMark: 10, preservePath: true }
        );
    });

    it('should parse multipart body with default options', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                is: () => true,
            },
        });

        await createParseMultipartBody()(context, next);

        expect(mockBusboy).toHaveBeenCalledWith(
            {
                request: {
                    ...context.request,
                },
            },
            { autoFields: true }
        );
    });
});
