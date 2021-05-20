import type Koa from 'koa';
import type { ErrorType, ValidationErrorResponse, ValidationErrors } from '../types';
import { isEmptyObject, isObject, filterObject } from '../utils/object';

const errorTypes: ErrorType[] = ['params', 'query', 'headers', 'body', 'type'];

const prepareMessage = (invalid: ValidationErrors): string => {
    const errorAreas = errorTypes
        .map((type) => (invalid[type] ? type : false))
        .filter(Boolean)
        .join(', ');

    return `Error in request ${errorAreas}`;
};

export default async function errorHandler(ctx: Koa.Context, next: Koa.Next): Promise<void> {
    const invalid = ctx.invalid as ValidationErrors | undefined;
    if (invalid !== undefined && isObject(invalid) && !isEmptyObject(invalid)) {
        const invalidFiltered = filterObject(invalid, errorTypes);
        if (isEmptyObject(invalidFiltered)) {
            return;
        }

        const body: ValidationErrorResponse = {
            code: 400,
            message: prepareMessage(invalidFiltered),
            ...invalidFiltered,
        };

        ctx.status = 400;
        ctx.body = body;
    } else {
        await next();
    }
}
