import type Koa from 'koa';
import type { ErrorType, ValidationErrorResponse, ValidationErrors } from '../@types';

const errorTypes: ErrorType[] = ['params', 'query', 'headers', 'body', 'type'];

const prepareMessage = (invalid: ValidationErrors): string => {
    const errorAreas = errorTypes
        .map((type) => (invalid[type] ? type : false))
        .filter(Boolean)
        .join(', ');

    return `Error in request ${errorAreas}`;
};

export default async function errorHandler(ctx: Koa.Context, next: Koa.Next): Promise<void> {
    await next();

    const invalid = ctx.invalid as ValidationErrors | undefined;
    if (invalid) {
        const body: ValidationErrorResponse = {
            code: 400,
            message: prepareMessage(invalid),
            ...invalid,
        };

        ctx.status = 400;
        ctx.body = body;
    }
}
