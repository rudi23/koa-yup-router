import delegate from 'delegates';
import KoaRouter from '@koa/router';
import type Koa from 'koa';
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
    RouteConfig,
    RouteSpecification,
    RouterOptions,
    DefaultState,
    DefaultContext,
    Middleware,
} from './types';
import validatePreHandler from './utils/validateSpecification/validatePreHandler';

class YupRouter<StateRT = DefaultState, ContextRT = DefaultContext> extends KoaRouter {
    routeSpecs: RouteSpecification<any, any, any, any, any, any>[] = [];

    router = new KoaRouter();

    errorHandler = <Middleware>errorHandler;

    preHandlers = <Middleware[]>[];

    constructor(options?: RouterOptions) {
        super();
        if (!(this instanceof YupRouter)) {
            return new YupRouter<StateRT, ContextRT>(options);
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
        HeadersT = DefaultHeaders,
        StateT = StateRT,
        ContextT = ContextRT
    >(config: RouteConfig<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>): YupRouter {
        this.registerRoute(config);

        return this;
    }

    private registerRoute<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(
        config: RouteConfig<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
    ): KoaRouter.Layer {
        const spec = validateSpecification<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>(config);

        this.routeSpecs.push(spec);

        const { handlers, name, methods, path, preHandlers } = spec;

        const middlewares = [
            ...this.preHandlers,
            ...preHandlers,
            exposeSpecification(spec),
            parseBody(spec),
            validate(spec),
            this.errorHandler,
            ...handlers,
        ] as Koa.Middleware[];

        const opts = name ? { name } : undefined;

        return this.router.register(path, methods, middlewares, opts);
    }
}

export * from './types';

export default YupRouter;
