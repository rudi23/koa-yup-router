import validatePreHandler from '../../../../src/utils/validateSpecification/validatePreHandler.js';
import isHandlerSupportedFunction from '../../../../src/utils/validateSpecification/isHandlerSupportedFunction.js';

jest.mock('../../../../src/utils/validateSpecification/isHandlerSupportedFunction.js');

const mockIsHandlerSupportedFunction = (isHandlerSupportedFunction as jest.Mock).mockImplementation(
    (arg: unknown) => arg
);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const fn = () => {};

describe('utils/validateSpecification/validatePreHandler', () => {
    it('checks if preHandler is supported function', () => {
        validatePreHandler(fn);
        expect(mockIsHandlerSupportedFunction).toHaveBeenCalledWith(fn);
    });

    it('returns empty array if preHandler is not defined', () => {
        const preHandlers = validatePreHandler(undefined);
        expect(preHandlers).toEqual([]);
    });
});
