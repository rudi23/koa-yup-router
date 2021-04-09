import validatePreHandler from '@src/utils/validateSpecification/validatePreHandler';
import isHandlerSupportedFunction from '@src/utils/validateSpecification/isHandlerSupportedFunction';

jest.mock('@src/utils/validateSpecification/isHandlerSupportedFunction');

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

    it('checks if nested preHandler is supported function', () => {
        validatePreHandler([[[fn]]]);
        expect(mockIsHandlerSupportedFunction).toHaveBeenCalledWith(fn);
    });

    it('returns empty array if preHandler is not defined', () => {
        const preHandlers = validatePreHandler(undefined);
        expect(preHandlers).toEqual([]);
    });

    it('returns flat preHandlers', () => {
        const preHandlers = validatePreHandler([[[fn]], fn]);
        expect(preHandlers).toHaveLength(2);
        expect(preHandlers[0]).toBeInstanceOf(Function);
        expect(preHandlers[1]).toBeInstanceOf(Function);
    });
});
