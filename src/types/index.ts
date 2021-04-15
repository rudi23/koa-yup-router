/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ParsedUrlQuery } from 'querystring';
import type { IncomingHttpHeaders } from 'http';
import type CoBody from 'co-body';
import type * as Koa from 'koa';
import type * as Yup from 'yup';
import type * as KoaRouter from '@koa/router';
import type YupRouter from '../index';

// because we don not want koa-bodyparser/index.d.ts to set body?: any
declare module 'koa' {
    interface Request {
        body?: unknown;
        rawBody: string;
        parts?: unknown;
    }
}

type NestedHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
> = ReadonlyArray<Handler<ParamsT, QueryT, BodyT, HeadersT>>;

export interface RouterOptions extends KoaRouter.RouterOptions {
    errorHandler?: Handler;
    preHandler?: Handler | Handler[];
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

export type DefaultParams = Record<string, any>;
export type DefaultQuery = Record<string, any>;
export type DefaultBody = unknown;
export type DefaultHeaders = Record<string, any>;

export type Handler<ParamsT = DefaultParams, QueryT = DefaultQuery, BodyT = DefaultBody, HeadersT = DefaultHeaders> =
    | RouterMiddleware<ParamsT, QueryT, BodyT, HeadersT>
    | NestedHandler<ParamsT, QueryT, BodyT, HeadersT>;

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
    HeadersT = DefaultHeaders
> = {
    preHandler?: Handler<ParamsT, QueryT, BodyT, HeadersT> | Handler<ParamsT, QueryT, BodyT, HeadersT>[];
    validate?: ValidateConfig;
    meta?: any;
    name?: string;
    method: string | string[];
    path: string | RegExp;
    handler: Handler<ParamsT, QueryT, BodyT, HeadersT> | Handler<ParamsT, QueryT, BodyT, HeadersT>[];
};

export type RouteSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
> = {
    preHandlers: Handler<ParamsT, QueryT, BodyT, HeadersT>[];
    validate?: ValidateConfig;
    meta?: any;
    name?: string;
    methods: string[];
    path: string | RegExp;
    handlers: Handler<ParamsT, QueryT, BodyT, HeadersT>[];
};

export interface RouterParameterizedContext<
    ParamsT = DefaultParams,
    QueryT = ParsedUrlQuery,
    BodyT = DefaultBody,
    HeadersT = IncomingHttpHeaders,
    StateT = Koa.DefaultState,
    ContextT = Koa.DefaultContext
> extends Koa.ParameterizedContext {
    params: ParamsT;
    request: Koa.Request & { query: QueryT; body: BodyT; header: HeadersT; headers: HeadersT };
    router: YupRouter<StateT, ContextT>;
    _matchedRoute: string | RegExp | undefined;
    _matchedRouteName: string | undefined;
}

export type RouterContext<
    ParamsT = DefaultParams,
    QueryT = ParsedUrlQuery,
    BodyT = DefaultBody,
    HeadersT = IncomingHttpHeaders,
    StateT = Koa.DefaultState,
    ContextT = Koa.DefaultState
> = Koa.ParameterizedContext<
    StateT,
    ContextT & RouterParameterizedContext<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>
>;

export type RouterMiddleware<
    ParamsT = DefaultParams,
    QueryT = ParsedUrlQuery,
    BodyT = DefaultBody,
    HeadersT = IncomingHttpHeaders,
    StateT = Koa.DefaultState,
    ContextT = Koa.DefaultState
> = Koa.Middleware<StateT, ContextT & RouterParameterizedContext<ParamsT, QueryT, BodyT, HeadersT, StateT, ContextT>>;
