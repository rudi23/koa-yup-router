import validateMethod from '@src/utils/validateSpecification/validateMethod';

describe('utils/validateSpecification/validateMethod', () => {
    it('throws error when method is not defined', () => {
        expect(() => validateMethod((undefined as unknown) as string)).toThrow(
            'Missing route methods',
        );
    });

    it('throws error when method is not string or array', () => {
        expect(() => validateMethod((1 as unknown) as string)).toThrow(
            'Route methods must be an array or string',
        );
    });

    it('splits if method is defining multiple methods', () => {
        const methods = validateMethod('get post put');

        expect(methods).toEqual(['get', 'post', 'put']);
    });

    it('accepts method as array defining multiple methods', () => {
        const methods = validateMethod(['get', 'post', 'put']);

        expect(methods).toEqual(['get', 'post', 'put']);
    });

    it('throws error when method is empty array', () => {
        expect(() => validateMethod([])).toThrow('Missing route methods');
    });

    it('makes method values lowercase', () => {
        const methods = validateMethod(['GET', 'Post', 'pUT']);

        expect(methods).toEqual(['get', 'post', 'put']);
    });
});
