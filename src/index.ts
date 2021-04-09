import delegate from 'delegates';
import KoaRouter from '@koa/router';
import parseBody from './middlewares/parseBody';
import exposeSpecification from './middlewares/exposeSpecification';
import validate from './middlewares/validate';
import errorHandler from './middlewares/errorHandler';
import validateSpecification from './utils/validateSpecification';
import type {
    DefaultBody,
    DefaultHeaders,
    DefaultParams,
    DefaultQuery,
    Handler,
    RouteConfig,
    RouteSpecification,
    RouterOptions,
} from './@types';
import validatePreHandler from '@src/utils/validateSpecification/validatePreHandler';

class YupRouter<StateT = any, CustomT = Record<string, any>> extends KoaRouter {
    routeSpecs: RouteSpecification<any, any, any, any>[] = [];

    router = new KoaRouter();

    errorHandler = <Handler>errorHandler;

    preHandlers = <Handler[]>[];

    constructor(options?: RouterOptions) {
        super();
        if (!(this instanceof YupRouter)) {
            return new YupRouter<StateT, CustomT>(options);
        }

        const { errorHandler: customErrorHandler, preHandler, ...baseOptions } = options ?? {};

        this.errorHandler = customErrorHandler || errorHandler;
        this.preHandlers = validatePreHandler(preHandler);
        this.routeSpecs = [];
        this.router = new KoaRouter(baseOptions);

        delegate(YupRouter.prototype, 'router')
            .method('use')
            .method('prefix')
            .method('routes')
            .method('middleware')
            .method('allowedMethods')
            .method('all')
            .method('redirect')
            .method('register')
            .method('route')
            .method('url')
            .method('param');
    }

    addRoute<
        ParamsT = DefaultParams,
        QueryT = DefaultQuery,
        BodyT = DefaultBody,
        HeadersT = DefaultHeaders
    >(config: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>): YupRouter {
        this.registerRoute(config);

        return this;
    }

    private registerRoute<
        ParamsT = DefaultParams,
        QueryT = DefaultQuery,
        BodyT = DefaultBody,
        HeadersT = DefaultHeaders
    >(config: RouteConfig<ParamsT, QueryT, BodyT, HeadersT>): KoaRouter.Layer {
        const spec = validateSpecification<ParamsT, QueryT, BodyT, HeadersT>(config);

        this.routeSpecs.push(spec);

        const { name, path } = spec;
        const methods = [spec.methods].flat();
        const preHandlers = spec.preHandlers ? [spec.preHandlers].flat(Infinity) : [];
        const handlers = spec.handlers ? [spec.handlers].flat(Infinity) : [];

        const middlewares = [
            this.errorHandler,
            ...this.preHandlers,
            ...preHandlers,
            exposeSpecification(spec),
            parseBody(spec),
            validate(spec),
            ...handlers,
        ];

        const opts = name ? { name } : undefined;

        return this.router.register(path, methods, middlewares, opts);
    }
}

export default YupRouter;
