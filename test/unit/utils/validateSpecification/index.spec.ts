import { valueOfType } from '../../../utils';
import validateSpecification from '../../../../src/utils/validateSpecification/index.js';
import type { RouteConfig } from '../../../../src/types/index.js';
import validateHandler from '../../../../src/utils/validateSpecification/validateHandler.js';
import validatePreHandler from '../../../../src/utils/validateSpecification/validatePreHandler.js';
import validateMethod from '../../../../src/utils/validateSpecification/validateMethod.js';
import validateRoutePath from '../../../../src/utils/validateSpecification/validateRoutePath.js';
import validateValidator from '../../../../src/utils/validateSpecification/validateValidator.js';

jest.mock('../../../../src/utils/validateSpecification/validateHandler.js');
jest.mock('../../../../src/utils/validateSpecification/validatePreHandler.js');
jest.mock('../../../../src/utils/validateSpecification/validateMethod.js');
jest.mock('../../../../src/utils/validateSpecification/validateRoutePath.js');
jest.mock('../../../../src/utils/validateSpecification/validateValidator.js');

const mockValidateHandler = (validateHandler as jest.Mock).mockImplementation((arg: unknown) => [arg]);
const mockValidatePreHandler = (validatePreHandler as jest.Mock).mockImplementation((arg: unknown) => [arg]);
const mockValidateMethod = (validateMethod as jest.Mock).mockImplementation((arg: unknown) => [arg]);
const mockValidateRoutePath = (validateRoutePath as jest.Mock).mockImplementation((arg: unknown) => arg);
const mockValidateValidator = (validateValidator as jest.Mock).mockImplementation((arg: unknown) => arg);

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
