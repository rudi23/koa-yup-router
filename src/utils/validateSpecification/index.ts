import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    RouteConfig,
    RouteSpecification,
} from '../../@types';
import validateValidator from './validateValidator';
import validateMethod from './validateMethod';
import validateHandler from './validateHandler';
import validatePreHandler from './validatePreHandler';
import validateRoutePath from './validateRoutePath';

export default function validateSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(
    spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>,
): RouteSpecification<ParamsT, QueryT, BodyT, HeadersT> {
    if (!spec) {
        throw new Error('Missing route specification');
    }

    const path = validateRoutePath(spec.path);
    const methods = validateMethod(spec.method);
    const preHandlers = validatePreHandler<ParamsT, QueryT, BodyT, HeadersT>(spec.preHandler);
    const handlers = validateHandler<ParamsT, QueryT, BodyT, HeadersT>(spec.handler);
    const validate = validateValidator(spec.validate);

    return <RouteSpecification>{
        handlers,
        meta: spec.meta,
        methods,
        name: spec.name,
        preHandlers,
        path,
        validate,
    };
}
