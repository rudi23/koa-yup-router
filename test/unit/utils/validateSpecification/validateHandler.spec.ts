import validateHandler from '../../../../src/utils/validateSpecification/validateHandler.js';
import isHandlerSupportedFunction from '../../../../src/utils/validateSpecification/isHandlerSupportedFunction.js';
import validatePreHandler from '../../../../src/utils/validateSpecification/validatePreHandler.js';
import type { Middleware } from '../../../../src/types/index.js';

jest.mock('../../../../src/utils/validateSpecification/isHandlerSupportedFunction.js');

const mockIsHandlerSupportedFunction = (isHandlerSupportedFunction as jest.Mock).mockImplementation(
    (arg: unknown) => arg
);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const fn = () => {};

describe('utils/validateSpecification/validateHandler', () => {
    it('throws error when config.handlers is not defined', () => {
        expect(() => validateHandler(undefined as unknown as Middleware)).toThrow('Missing route handlers');
    });

    it('checks if handler is supported function', () => {
        validatePreHandler(fn);
        expect(mockIsHandlerSupportedFunction).toHaveBeenCalledWith(fn);
    });

    it('checks if nested handler is supported function', () => {
        validatePreHandler([fn]);
        expect(mockIsHandlerSupportedFunction).toHaveBeenCalledWith(fn);
    });
});
