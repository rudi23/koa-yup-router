import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    Handler,
    RouteConfig,
    RouteSpecification,
    ValidateConfig,
} from '../@types';

function checkHandler<ParamsT = DefaultParams, QueryT = DefaultQuery, BodyT = DefaultBody, HeadersT = DefaultHeaders>(
    spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>
): Handler<ParamsT, QueryT, BodyT, HeadersT>[] {
    if (!spec.handler) {
        throw new Error('Missing route handler');
    }

    return [spec.handler].flat(Infinity).map(isSupportedFunction);
}

function checkPreHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>): Handler<ParamsT, QueryT, BodyT, HeadersT>[] {
    if (!spec.preHandler) {
        return [];
    }

    return [spec.preHandler].flat(Infinity).map(isSupportedFunction);
}

function isSupportedFunction<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(handler: Handler<ParamsT, QueryT, BodyT, HeadersT>): Handler<ParamsT, QueryT, BodyT, HeadersT> {
    if (typeof handler !== 'function') {
        throw new Error('Route handler must be a function');
    }
    if (handler && handler.constructor && handler.constructor.name === 'GeneratorFunction') {
        throw new Error('Route handlers must not be GeneratorFunctions. Please use "async function" or "function".');
    }

    return handler;
}

function checkMethods<ParamsT = DefaultParams, QueryT = DefaultQuery, BodyT = DefaultBody, HeadersT = DefaultHeaders>(
    spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>
): string[] {
    let methods = spec.method;

    if (!methods) {
        throw new Error('Missing route method');
    }

    if (typeof spec.method === 'string') {
        methods = spec.method.split(' ');
    }

    if (!Array.isArray(methods)) {
        throw new TypeError('Route methods must be an array or string');
    }

    if (methods.length === 0) {
        throw new Error('Missing route method');
    }

    return methods.map((method) => method.toLowerCase());
}

function checkValidators<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>): ValidateConfig {
    if (!spec.validate) {
        return {};
    }

    if (spec.validate.body && (!spec.validate?.type || !['json', 'form'].includes(spec.validate.type))) {
        throw new Error('validate.type must be declared when using validate.body');
    }

    if (spec.validate.type && !['json', 'form', 'multipart', 'stream'].includes(spec.validate.type)) {
        throw new Error('validate.type must be either json, form, multipart or stream');
    }

    return spec.validate;
}

export default function validateSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
>(spec: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>): RouteSpecification<ParamsT, QueryT, BodyT, HeadersT> {
    if (!spec) {
        throw new Error('Missing route specification');
    }

    if (typeof spec.path !== 'string' || (spec.path as any) instanceof RegExp) {
        throw new Error('Invalid route path');
    }

    const preHandlers = checkPreHandler<ParamsT, QueryT, BodyT, HeadersT>(spec);
    const handlers = checkHandler<ParamsT, QueryT, BodyT, HeadersT>(spec);
    const method = checkMethods<ParamsT, QueryT, BodyT, HeadersT>(spec);
    const validators = checkValidators<ParamsT, QueryT, BodyT, HeadersT>(spec);

    return <RouteSpecification>{
        ...spec,
        method,
        preHandler: preHandlers,
        handler: handlers,
        validate: validators,
    };
}
