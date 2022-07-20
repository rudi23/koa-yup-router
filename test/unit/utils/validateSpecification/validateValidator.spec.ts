import * as yup from 'yup';
import validateValidator from '../../../../src/utils/validateSpecification/validateValidator.js';
import type { ValidateConfig } from '../../../../src/types/index.js';

describe('utils/validateSpecification/validateValidator', () => {
    it('returns empty validator if validate is not defined', () => {
        const validator = validateValidator(undefined);

        expect(validator).toEqual({});
    });

    it('returns empty validator if validate is empty object', () => {
        const validator = validateValidator({});

        expect(validator).toEqual({});
    });

    it('throws error when validate.type is invalid', () => {
        expect(() =>
            validateValidator({
                type: 'invalid' as unknown as ValidateConfig['type'],
            })
        ).toThrow('validate.type must be either json, form, multipart or stream');
    });

    it('throws error when validate.body is not yup.object', () => {
        expect(() =>
            validateValidator({
                body: {} as unknown as yup.ObjectSchema<any>,
            })
        ).toThrow('validate.body must be instance of yup.object');
    });

    it('throws error when validate.params is not yup.object', () => {
        expect(() =>
            validateValidator({
                params: {} as unknown as yup.ObjectSchema<any>,
            })
        ).toThrow('validate.params must be instance of yup.object');
    });

    it('throws error when validate.query is not yup.object', () => {
        expect(() =>
            validateValidator({
                query: {} as unknown as yup.ObjectSchema<any>,
            })
        ).toThrow('validate.query must be instance of yup.object');
    });

    it('throws error when validate.headers is not yup.object', () => {
        expect(() =>
            validateValidator({
                headers: {} as unknown as yup.ObjectSchema<any>,
            })
        ).toThrow('validate.headers must be instance of yup.object');
    });

    it('throws error when validate.type for body is not defined', () => {
        expect(() =>
            validateValidator({
                body: yup.object({}),
            })
        ).toThrow('validate.type must be declared when using validate.body');
    });

    it('throws error when validate.type for body is invalid', () => {
        expect(() =>
            validateValidator({
                body: yup.object({}),
                type: 'stream',
            })
        ).toThrow('validate.type must either json or form when using validate.body');
    });

    it('returns valid validator', () => {
        const validator = validateValidator({
            body: yup.object({}),
            type: 'json',
        });

        expect(Object.keys(validator)).toHaveLength(2);
        expect(validator.type).toBe('json');
        expect(validator.body).toBeInstanceOf(yup.ObjectSchema);
    });
});
