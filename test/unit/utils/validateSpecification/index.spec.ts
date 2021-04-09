import { valueOfType } from '../../../utils';
import validateSpecification from '@src/utils/validateSpecification';
import type { RouteConfig } from '@src/@types';
import validateHandler from '@src/utils/validateSpecification/validateHandler';
import validatePreHandler from '@src/utils/validateSpecification/validatePreHandler';
import validateMethod from '@src/utils/validateSpecification/validateMethod';
import validateRoutePath from '@src/utils/validateSpecification/validateRoutePath';
import validateValidator from '@src/utils/validateSpecification/validateValidator';

jest.mock('@src/utils/validateSpecification/validateHandler');
jest.mock('@src/utils/validateSpecification/validatePreHandler');
jest.mock('@src/utils/validateSpecification/validateMethod');
jest.mock('@src/utils/validateSpecification/validateRoutePath');
jest.mock('@src/utils/validateSpecification/validateValidator');

const mockValidateHandler = (validateHandler as jest.Mock).mockImplementation((arg: unknown) => [
    arg,
]);
const mockValidatePreHandler = (validatePreHandler as jest.Mock).mockImplementation(
    (arg: unknown) => [arg],
);
const mockValidateMethod = (validateMethod as jest.Mock).mockImplementation((arg: unknown) => [
    arg,
]);
const mockValidateRoutePath = (validateRoutePath as jest.Mock).mockImplementation(
    (arg: unknown) => arg,
);
const mockValidateValidator = (validateValidator as jest.Mock).mockImplementation(
    (arg: unknown) => arg,
);

describe('utils/validateSpecification', () => {
    it('throws error when config is not provided', () => {
        const config = valueOfType<RouteConfig>(undefined);

        expect(() => validateSpecification(config)).toThrow('Missing route specification');
    });

    it('returns valid specification from config', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const fn = () => {};
        const config: RouteConfig = {
            name: 'name',
            path: '/path',
            method: 'get',
            handler: fn,
            preHandler: fn,
            validate: {},
            meta: { foo: 'bar' },
        };

        const specification = validateSpecification(config);

        expect(specification).toEqual({
            name: 'name',
            path: '/path',
            methods: ['get'],
            handlers: [fn],
            preHandlers: [fn],
            validate: {},
            meta: { foo: 'bar' },
        });
        expect(mockValidateHandler).toHaveBeenCalled();
        expect(mockValidatePreHandler).toHaveBeenCalled();
        expect(mockValidateMethod).toHaveBeenCalled();
        expect(mockValidateRoutePath).toHaveBeenCalled();
        expect(mockValidateValidator).toHaveBeenCalled();
    });
});
