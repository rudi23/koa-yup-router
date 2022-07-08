import isHandlerSupportedFunction from '@src/utils/validateSpecification/isHandlerSupportedFunction';
import type { Middleware } from '@src/types';

describe('utils/validateSpecification/isHandlerSupportedFunction', () => {
    it('throws error when handler is not defined', () => {
        expect(() => isHandlerSupportedFunction(undefined as unknown as Middleware)).toThrow(
            'Route handler must be a function'
        );
    });
    it('throws error when handler is string', () => {
        expect(() => isHandlerSupportedFunction('invalid handler' as unknown as Middleware)).toThrow(
            'Route handler must be a function'
        );
    });
    it('returns handler if it is function', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const fn = () => {};
        const handler = isHandlerSupportedFunction(fn);

        expect(handler).toBeInstanceOf(Function);
    });
});
