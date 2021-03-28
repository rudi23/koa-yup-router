import type Koa from 'koa';
import type * as Yup from 'yup';
import type { ErrorType, ValidationErrors } from '../@types';

export default function captureError(ctx: Koa.Context, type: ErrorType, err: Yup.ValidationError): void {
    const invalid: ValidationErrors = ctx.invalid || {};

    invalid[type] = err;

    ctx.invalid = invalid;
}
