# koa-yup-router

[Koa] router with [yup] input validation and Typescript support.

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@rudi23/koa-yup-router.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rudi23/koa-yup-router
[download-image]: https://img.shields.io/npm/dm/@rudi23/koa-yup-router.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@rudi23/koa-yup-router
[koa]: http://koajs.com
[co-body]: https://github.com/visionmedia/co-body
[await-busboy]: https://github.com/aheckmann/await-busboy
[yup]: https://github.com/jquense/yup
[@koa/router]: https://github.com/koajs/router

### Installation

Install using [`npm`][npm-url]:

```bash
npm install @rudi23/koa-yup-router
```

NodeJS `>= 12.0.0.` is required.

### Features

-   all features of [@koa/router][] as it's built on top of it
-   input validation using [yup][]
-   Typescript support for request params, query, headers and body
-   type casting request values
-   body parsing using [co-body][] and [await-busboy][]
-   multiple method support
-   router middleware support
-   custom error handler
-   exposed route definitions
-   meta data support
-   supports both: CommonJs and ES Modules

### Example

##### Typescript

```ts
import Koa from 'koa';
import YupRouter from '@rudi23/koa-yup-router';

const paramsSchema = yup.object({
    id: yup.number().required(),
});

const querySchema = yup.object({
    force: yup.boolean(),
});

const bodySchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.number().required(),
    age: yup.number().required().min(0).max(100),
    job: yup.string(),
});

const router = new YupRouter();

router.get('/', (ctx, next) => {
    ctx.body = 'Hello koa-yup-router!';
});

router.addRoute<TypeOf<typeof paramsSchema>, TypeOf<typeof querySchema>, TypeOf<typeof bodySchema>>(
    {
        method: 'put',
        path: '/user/:id',
        validate: {
            type: 'json',
            body: bodySchema,
            params: paramsSchema,
            query: querySchema,
        },
        handler: (ctx) => {
            ctx.body = {
                params: ctx.params,
                query: ctx.request.query,
                body: ctx.request.body,
                headers: ctx.request.headers,
            };
        },
    },
);

const app = new Koa();
app.use(router.middleware());
app.listen(3000);
```

##### Javascript - CommonJS

```js
const Koa = require('koa');
const YupRouter = require('@rudi23/koa-yup-router');

const paramsSchema = yup.object({
    id: yup.number().required(),
});

const querySchema = yup.object({
    force: yup.boolean(),
});

const bodySchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.number().required(),
    age: yup.number().required().min(0).max(100),
    job: yup.string(),
});

const router = new YupRouter();

router.get('/', (ctx, next) => {
    ctx.body = 'Hello koa-yup-router!';
});

router.addRoute({
    method: 'put',
    path: '/user/:id',
    validate: {
        type: 'json',
        body: bodySchema,
        params: paramsSchema,
        query: querySchema,
    },
    handler: (ctx) => {
        ctx.body = {
            params: ctx.params,
            query: ctx.request.query,
            body: ctx.request.body,
            headers: ctx.request.headers,
        };
    },
});

const app = new Koa();
app.use(router.middleware());
app.listen(3000);
```

##### Javascript - ES Modules

```js
import Koa from 'koa';
import YupRouter from '@rudi23/koa-yup-router';

const paramsSchema = yup.object({
    id: yup.number().required(),
});

const querySchema = yup.object({
    force: yup.boolean(),
});

const bodySchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.number().required(),
    age: yup.number().required().min(0).max(100),
    job: yup.string(),
});

const router = new YupRouter();

router.get('/', (ctx, next) => {
    ctx.body = 'Hello koa-yup-router!';
});

router.addRoute({
    method: 'put',
    path: '/user/:id',
    validate: {
        type: 'json',
        body: bodySchema,
        params: paramsSchema,
        query: querySchema,
    },
    handler: (ctx) => {
        ctx.body = {
            params: ctx.params,
            query: ctx.request.query,
            body: ctx.request.body,
            headers: ctx.request.headers,
        };
    },
});

const app = new Koa();
app.use(router.middleware());
app.listen(3000);
```

## LICENSE

[MIT](https://github.com/rudi23/koa-yup-router/blob/master/LICENSE)
