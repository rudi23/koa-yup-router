import validateRoutePath from '@src/utils/validateSpecification/validateRoutePath';

describe('utils/validateSpecification/validateRoutePath', () => {
    it('throws error when path is not string', () => {
        expect(() => validateRoutePath(1 as unknown as string)).toThrow('Invalid route path');
    });

    it('returns path when path is RegExp', () => {
        const path = validateRoutePath(/[a-z]*/);

        expect(path).toStrictEqual(/[a-z]*/);
    });

    it('returns path when path is string', () => {
        const path = validateRoutePath('/path');

        expect(path).toBe('/path');
    });
});
