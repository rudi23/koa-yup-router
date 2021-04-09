import * as yup from 'yup';

export const paramsSchema = yup.object({
    id: yup.number().required(),
});

export const querySchema = yup.object({
    search: yup.string().required(),
});

export const bodySchema = yup.object({
    number: yup.number().required().min(0).max(100),
    string: yup.string().required(),
    object: yup.object({
        bool: yup.boolean().required(),
    }),
});

export const headersSchema = yup.object({
    custom: yup.string().required(),
});
