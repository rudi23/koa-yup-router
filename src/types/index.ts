/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type CoBody from 'co-body';
import type * as Koa from 'koa';
import type * as Yup from 'yup';
import type * as KoaRouter from '@koa/router';
import type YupRouter from '../index.js';

// because we don not want koa-bodyparser/index.d.ts to set body?: any
declare module 'koa' {
    interface Request {
        body?: unknown;
        rawBody: string;
        parts?: unknown;
    }
}

export interface RouterOptions extends KoaRouter.RouterOptions {
    errorHandler?: Middleware;
    preHandler?: Middleware | Array<Middleware>;
}

export type MultipartBodyOptions = {
    headers?: any;
    highWaterMark?: number;
    fileHwm?: number;
    defCharset?: string;
    preservePath?: boolean;
    limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
    };
};

export type DefaultParams = any;
export type DefaultQuery = any;
export type DefaultBody = any;
export type DefaultHeaders = any;
export type DefaultState = Koa.DefaultState;
export type DefaultContext = Koa.DefaultContext;

export type FormBodyOptions = CoBody.Options;
export type JsonBodyOptions = CoBody.Options;
export type InputType = 'form' | 'json' | 'multipart' | 'stream';
export type ValidationType = 'headers' | 'query' | 'params' | 'body';
export type ErrorType = ValidationType | 'type';
export type ValidationSchema = Yup.ObjectSchema<any>;

export type ValidateConfigBase = {
    [K in ValidationType]?: ValidationSchema;
};

export type ValidateConfig = ValidateConfigBase & {
    maxBody?: number;
    type?: InputType;
    formOptions?: FormBodyOptions;
    jsonOptions?: JsonBodyOptions;
    multipartOptions?: MultipartBodyOptions;
};

export type ValidationErrors = {
    [T in ErrorType]?: Yup.ValidationError;
};

export type ValidationErrorResponse = ValidationErrors & {
    code: 400;
    message: string;
};

export type RouteConfig<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = {
    preHandler?:
        | Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
        | Array<Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>>;
    validate?: ValidateConfig;
    meta?: any;
    name?: string;
    method: string | string[];
    path: string | RegExp;
    handler:
        | Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
        | Array<Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>>;
};

export type RouteSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = {
    preHandlers: Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>[];
    validate: ValidateConfig;
    meta?: any;
    name?: string;
    methods: string[];
    path: string | RegExp;
    handlers: Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>[];
};

export type RouterParamContext<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = {
    params: ParamsT;
    request: Koa.Request & { query: QueryT; body: BodyT; header: HeadersT; headers: HeadersT };
    router: YupRouter<StateT, ContextT>;
    _matchedRoute: string | RegExp | undefined;
    _matchedRouteName: string | undefined;
};

export type RouterContext<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = Koa.ParameterizedContext<StateT, ContextT & RouterParamContext<ParamsT, QueryT, BodyT, HeadersT>>;

export type Middleware<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = Koa.Middleware<StateT, ContextT & RouterParamContext<ParamsT, QueryT, BodyT, HeadersT>>;

/**
 * @deprecated use Middleware instead
 */
export type Handler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = Middleware<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>;

/**
 * @deprecated use RouterParamContext instead
 */
export type RouterParametrizedContext<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders,
    StateT = DefaultState,
    ContextT = DefaultContext
> = RouterParamContext<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>;
