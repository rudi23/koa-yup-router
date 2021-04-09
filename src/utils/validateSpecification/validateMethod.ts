import type { RouteConfig } from '../../@types';

export default function validateMethod(method: RouteConfig['method']): string[] {
    let methods = method;

    if (!methods) {
        throw new Error('Missing route methods');
    }

    if (typeof method === 'string') {
        methods = method.split(' ');
    }

    if (!Array.isArray(methods)) {
        throw new TypeError('Route methods must be an array or string');
    }

    if (methods.length === 0) {
        throw new Error('Missing route methods');
    }

    return methods.map((m) => m.toLowerCase());
}
