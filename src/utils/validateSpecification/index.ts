import type { RouteConfig, RouteSpecification } from '../../types/index.js';
import validateValidator from './validateValidator.js';
import validateMethod from './validateMethod.js';
import validateHandler from './validateHandler.js';
import validatePreHandler from './validatePreHandler.js';
import validateRoutePath from './validateRoutePath.js';

export default function validateSpecification<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(
    spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
): RouteSpecification<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT> {
    if (!spec) {
        throw new Error('Missing route specification');
    }

    const path = validateRoutePath(spec.path);
    const methods = validateMethod(spec.method);
    const preHandlers = validatePreHandler<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(spec.preHandler);
    const handlers = validateHandler<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(spec.handler);
    const validate = validateValidator(spec.validate);

    return {
        handlers,
        meta: spec.meta,
        methods,
        name: spec.name,
        preHandlers,
        path,
        validate,
    };
}
