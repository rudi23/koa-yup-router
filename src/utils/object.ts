export function isObject(x: unknown): boolean {
    return typeof x === 'object' && x !== null;
}

export function isEmptyObject(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

export function filterObject(obj: Record<string, any>, keys: string[]): Record<string, any> {
    return Object.keys(obj)
        .filter((key) => keys.includes(key))
        .reduce(
            (res, key) => ({
                ...res,
                [key]: obj[key],
            }),
            {}
        );
}
