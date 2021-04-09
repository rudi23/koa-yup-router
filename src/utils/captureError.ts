import type Koa from 'koa';
import type * as Yup from 'yup';
import type { ErrorType } from '../@types';

export default function captureError(ctx: Koa.Context, type: ErrorType, err: Yup.ValidationError): void {
    ctx.invalid = ctx.invalid || {};
    ctx.invalid[type] = err;
}
