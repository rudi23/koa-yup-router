import type Koa from 'koa';
import { ValidationError } from 'yup';
import { valueOfType } from '../../utils.js';
import captureError from '../../../src/utils/captureError.js';

describe('utils/captureError', () => {
    it('capture error', async () => {
        const context = valueOfType<Koa.Context>({});

        await captureError(context, 'type', new ValidationError('Type error'));

        expect(context.invalid.type).toBeInstanceOf(ValidationError);
        expect(context.invalid.type.message).toBe('Type error');
    });

    it('extends ctx.invalid if it exists', async () => {
        const context = valueOfType<Koa.Context>({
            invalid: {
                params: new ValidationError('Params error'),
                type: 'Unknown value',
            },
        });

        await captureError(context, 'type', new ValidationError('Type error'));

        expect(context.invalid.params).toBeInstanceOf(ValidationError);
        expect(context.invalid.params.message).toBe('Params error');
        expect(context.invalid.type).toBeInstanceOf(ValidationError);
        expect(context.invalid.type.message).toBe('Type error');
    });
});
