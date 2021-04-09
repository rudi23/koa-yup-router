import type { ObjectSchema } from 'yup';
import type Koa from 'koa';
import { valueOfType } from '../../utils';
import createValidate from '@src/middlewares/validate';
import captureError from '@src/utils/captureError';
// import * as constants from '@src/@types/constants';
import type { ValidateConfig } from '@src/@types';

jest.mock('@src/utils/captureError');

const mockCaptureError = (captureError as jest.Mock).mockImplementation(jest.fn());

const next = jest.fn();

const createMockSchema = (output: any) => ({
    validateSync: jest.fn().mockImplementation(() => output),
});
const createMockSchemaWithError = () => ({
    validateSync: jest.fn().mockImplementation(() => {
        throw Error('Invalid data');
    }),
});

const calledOptions = {
    abortEarly: false,
    recursive: true,
    strict: false,
    stripUnknown: false,
};

const mockInputParts = jest.fn().mockReturnValue(['headers', 'query', 'params', 'body']);
jest.mock('@src/@types/constants', () => ({
    get inputParts() {
        return mockInputParts();
    },
}));

describe('middleware/validate', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('should only call next() when validated is not defined', async () => {
        const context = valueOfType<Koa.Context>({});

        await createValidate({
            preHandlers: [],
            methods: [],
            handlers: [],
            path: '/path',
            validate: undefined,
        })(context, next);

        expect(context).toEqual({});
        expect(next).toHaveBeenCalled();
    });

    test('should validate params, query, headers, body and call next()', async () => {
        const context = valueOfType<Koa.Context>({
            params: { param1: 'string', param2: '1' },
            request: {
                query: { query1: 'string', query2: '2' },
                headers: { header1: 'string', header2: '3' },
                body: { body1: 'string', body2: '4' },
            },
        });
        const mockParamsSchema = createMockSchema({ param1: 'string', param2: 1 });
        const mockQuerySchema = createMockSchema({ query1: 'string', query2: 2 });
        const mockHeadersSchema = createMockSchema({ header1: 'string', header2: 3 });
        const mockBodySchema = createMockSchema({ body1: 'string', body2: 4 });

        await createValidate({
            preHandlers: [],
            methods: [],
            handlers: [],
            path: '/path',
            validate: {
                params: (mockParamsSchema as unknown) as ObjectSchema<any>,
                query: (mockQuerySchema as unknown) as ObjectSchema<any>,
                headers: (mockHeadersSchema as unknown) as ObjectSchema<any>,
                body: (mockBodySchema as unknown) as ObjectSchema<any>,
            },
        })(context, next);

        expect(context).toEqual({
            params: { param1: 'string', param2: 1 },
            request: {
                query: { query1: 'string', query2: 2 },
                headers: { header1: 'string', header2: 3 },
                body: { body1: 'string', body2: 4 },
            },
        });
        expect(mockParamsSchema.validateSync).toHaveBeenCalledWith({ param1: 'string', param2: 1 }, calledOptions);
        expect(mockQuerySchema.validateSync).toHaveBeenCalledWith({ query1: 'string', query2: 2 }, calledOptions);
        expect(mockHeadersSchema.validateSync).toHaveBeenCalledWith({ header1: 'string', header2: 3 }, calledOptions);
        expect(mockBodySchema.validateSync).toHaveBeenCalledWith({ body1: 'string', body2: 4 }, calledOptions);
        expect(next).toHaveBeenCalled();
    });

    test('should validate parts for which validate is set and call next()', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                query: { query1: 'string', query2: '2' },
                headers: { header1: 'string', header2: '3' },
            },
        });
        const mockQuerySchema = createMockSchema({ query1: 'string', query2: 2 });

        await createValidate({
            preHandlers: [],
            methods: [],
            handlers: [],
            path: '/path',
            validate: {
                query: (mockQuerySchema as unknown) as ObjectSchema<any>,
            },
        })(context, next);

        expect(context).toEqual({
            request: {
                query: { query1: 'string', query2: 2 },
                headers: { header1: 'string', header2: '3' },
            },
        });
        expect(mockQuerySchema.validateSync).toHaveBeenCalledWith({ query1: 'string', query2: 2 }, calledOptions);
        expect(next).toHaveBeenCalled();
    });

    test('should capture error when validation fails', async () => {
        const context = valueOfType<Koa.Context>({
            request: {
                query: { query1: 'string', query2: '2' },
            },
        });
        const mockQuerySchema = createMockSchemaWithError();

        await createValidate({
            preHandlers: [],
            methods: [],
            handlers: [],
            path: '/path',
            validate: {
                query: (mockQuerySchema as unknown) as ObjectSchema<any>,
            },
        })(context, next);

        expect(mockCaptureError).toHaveBeenCalledWith(
            {
                request: {
                    query: { query1: 'string', query2: '2' },
                },
            },
            'query',
            new Error('Invalid data')
        );
    });

    test('should capture error when unknown input part is defined', async () => {
        mockInputParts.mockReturnValue(['invalid']);

        const context = valueOfType<Koa.Context>({ request: { invalid: { foo: 'bar' } } });
        const mockQuerySchema = createMockSchema({});

        await createValidate({
            preHandlers: [],
            methods: [],
            handlers: [],
            path: '/path',
            validate: ({
                invalid: (mockQuerySchema as unknown) as ObjectSchema<any>,
            } as unknown) as ValidateConfig,
        })(context, next);

        expect(mockCaptureError).toHaveBeenCalledWith(
            {
                request: {
                    invalid: { foo: 'bar' },
                },
            },
            'invalid',
            new Error('Unknown input part')
        );
    });
});
