import type { RouteConfig, RouteSpecification } from '../../types';
import validateValidator from './validateValidator';
import validateMethod from './validateMethod';
import validateHandler from './validateHandler';
import validatePreHandler from './validatePreHandler';
import validateRoutePath from './validateRoutePath';

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
