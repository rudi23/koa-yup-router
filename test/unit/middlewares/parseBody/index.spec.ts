import type * as Koa from 'koa';
import * as yup from 'yup';
import { valueOfType } from '../../../utils';
import createParseBody from '@src/middlewares/parseBody';
import parseJsonBody from '@src/middlewares/parseBody/parseJsonBody';
import parseFormBody from '@src/middlewares/parseBody/parseFormBody';
import parseMultipartBody from '@src/middlewares/parseBody/parseMultipartBody';
import emptyMiddleware from '@src/middlewares/emptyMiddleware';
import captureError from '@src/utils/captureError';
import type { RouteSpecification } from '@src/@types';

jest.mock('@src/middlewares/parseBody/parseJsonBody');
jest.mock('@src/middlewares/parseBody/parseFormBody');
jest.mock('@src/middlewares/parseBody/parseMultipartBody');
jest.mock('@src/middlewares/emptyMiddleware');
jest.mock('@src/utils/captureError');

const mockParseJsonBody = parseJsonBody as jest.Mock;
const mockParseFormBody = parseFormBody as jest.Mock;
const mockParseMultipartBody = parseMultipartBody as jest.Mock;
const mockEmptyMiddleware = emptyMiddleware as jest.Mock;
const mockCaptureError = captureError as jest.Mock;
const next = jest.fn();

describe('middleware/parseBody', () => {
    it('should return empty middleware when spec.validate.type is not specified', async () => {
        const spec = valueOfType<RouteSpecification>({});
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockEmptyMiddleware).toHaveBeenCalled();
    });

    it('should parse form body and call next()', async () => {
        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'form',
            },
        });
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockParseFormBody).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should parse json body and call next()', async () => {
        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'json',
            },
        });
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockParseJsonBody).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should parse stream body and call next()', async () => {
        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'stream',
            },
        });
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockParseMultipartBody).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should parse multipart body and call next()', async () => {
        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'multipart',
            },
        });
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockParseMultipartBody).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('throw error when body type is unsupported', () => {
        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'unsupported',
            },
        });

        expect(() => createParseBody(spec)).toThrow('Unsupported body type specified: unsupported');
    });

    it('throw error that is captured when json body parser throws error and call next()', async () => {
        mockParseJsonBody.mockImplementation(function createMiddleware() {
            return async function middleware() {
                throw new Error('json body parser error');
            };
        });

        const spec = valueOfType<RouteSpecification>({
            validate: {
                type: 'json',
            },
        });
        const context = valueOfType<Koa.Context>({});

        await createParseBody(spec)(context, next);

        expect(mockCaptureError).toHaveBeenCalledWith({}, 'type', new yup.ValidationError('json body parser error'));
        expect(next).toHaveBeenCalled();
    });
});
