import * as yup from 'yup';
import type { RouteConfig, ValidateConfig } from '../../types';
import { isObject, isEmptyObject } from '../object';
import { inputParts } from '../../types/constants';

export default function validateValidator(validate: RouteConfig['validate']): ValidateConfig {
    if (validate === undefined) {
        return {};
    }

    if (isObject(validate) && isEmptyObject(validate)) {
        return {};
    }

    if (validate.type && !['json', 'form', 'multipart', 'stream'].includes(validate.type)) {
        throw new Error('validate.type must be either json, form, multipart or stream');
    }

    inputParts.forEach((inputPart) => {
        if (validate[inputPart] !== undefined && !(validate[inputPart] instanceof yup.object)) {
            throw new Error(`validate.${inputPart} must be instance of yup.object`);
        }
    });

    if (validate.body && !validate.type) {
        throw new Error('validate.type must be declared when using validate.body');
    }

    if (validate.body && validate.type && !['json', 'form'].includes(validate.type)) {
        throw new Error('validate.type must either json or form when using validate.body');
    }

    return validate;
}
