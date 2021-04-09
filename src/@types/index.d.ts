/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ParsedUrlQuery } from 'querystring';
import type { IncomingHttpHeaders } from 'http';
import type CoBody from 'co-body';
import type Busboy from 'busboy';
import type * as Koa from 'koa';
import type * as Yup from 'yup';
import type * as KoaRouter from '@koa/router';
import type YupRouter from '../index';

// because we don not want koa-bodyparser/index.d.ts body?: any
declare module 'koa' {
    interface Request {
        body?: unknown;
        rawBody: string;
    }
}

type NestedHandler<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
> = ReadonlyArray<Handler<ParamsT, QueryT, BodyT, HeadersT>>;

interface RouterParameterizedContext<ParamsT = DefaultParams, StateT = Koa.DefaultState, ContextT = Record<string, any>>
    extends Koa.Context {
    params: ParamsT;
    router: YupRouter<StateT, ContextT>;
    _matchedRoute: string | RegExp | undefined;
    _matchedRouteName: string | undefined;
}

interface RequestWithBody<BodyT = DefaultBody, QueryT = ParsedUrlQuery, HeadersT = IncomingHttpHeaders>
    extends Koa.Request<QueryT, HeadersT> {
    body: BodyT;
}

export type DefaultParams = Record<string, any>;
export type DefaultQuery = Record<string, any>;
export type DefaultBody = unknown;
export type DefaultHeaders = Record<string, any>;

export type Handler<ParamsT = DefaultParams, QueryT = DefaultQuery, BodyT = DefaultBody, HeadersT = DefaultHeaders> =
    | RouterMiddleware<ParamsT, QueryT, BodyT, HeadersT>
    | NestedHandler<ParamsT, QueryT, BodyT, HeadersT>;

export type FormBodyOptions = CoBody.Options;
export type JsonBodyOptions = CoBody.Options;
export type MultipartBodyOptions = Busboy.BusboyConfig;
export type InputType = 'form' | 'json' | 'multipart' | 'stream';
export type ValidationType = 'headers' | 'query' | 'params' | 'body';
export type ErrorType = ValidationType | 'type';

export type ValidateConfigBase = {
    [K in ValidationType]?: Yup.ObjectSchema<any>;
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

export interface RouterOptions extends KoaRouter.RouterOptions {
    errorHandler?: Handler;
    preHandler?: Handler | Handler[];
}

export interface RouteConfig<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
> {
    preHandler?: Handler<ParamsT, QueryT, BodyT, HeadersT> | Handler<ParamsT, QueryT, BodyT, HeadersT>[];
    validate?: ValidateConfig;
    meta?: any;
    name?: string;
    method: string | string[];
    path: string | RegExp;
    handler: Handler<ParamsT, QueryT, BodyT, HeadersT> | Handler<ParamsT, QueryT, BodyT, HeadersT>[];
}

export interface RouteSpecification<
    ParamsT = DefaultParams,
    QueryT = DefaultQuery,
    BodyT = DefaultBody,
    HeadersT = DefaultHeaders
> {
    preHandlers: Handler<ParamsT, QueryT, BodyT, HeadersT>[];
    validate?: ValidateConfig;
    meta?: any;
    name?: string;
    methods: string[];
    path: string | RegExp;
    handlers: Handler<ParamsT, QueryT, BodyT, HeadersT>[];
}

export type RouterContext<
    ParamsT = DefaultParams,
    QueryT = ParsedUrlQuery,
    BodyT = DefaultBody,
    HeadersT = IncomingHttpHeaders,
    StateT = Koa.DefaultState,
    ContextT = Record<string, any>
> = Koa.ParameterizedContext<
    StateT,
    ContextT & RouterParameterizedContext<ParamsT, StateT, ContextT>,
    unknown,
    QueryT,
    HeadersT,
    RequestWithBody<BodyT, QueryT, HeadersT>
>;

export type RouterMiddleware<
    ParamsT = DefaultParams,
    QueryT = ParsedUrlQuery,
    BodyT = DefaultBody,
    HeadersT = IncomingHttpHeaders,
    StateT = Koa.DefaultState,
    ContextT = Record<string, any>
> = Koa.Middleware<
    StateT,
    ContextT & RouterParameterizedContext<ParamsT, StateT, ContextT>,
    unknown,
    QueryT,
    HeadersT,
    RequestWithBody<BodyT, QueryT, HeadersT>
>;
