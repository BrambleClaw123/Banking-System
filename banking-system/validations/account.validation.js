const Joi = require('joi');

const updateBalanceSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
        'string.empty': 'Id không được để trống',
        'string.guid': 'Id không đúng định dạng UUID',
        'any.required': 'Vui lòng cung cấp id'
    }),

    amount: Joi.number().required().messages({
        'number.base': 'Balance phải là số',
        'any.required': 'Vui lòng cung cấp số tiền cần thực hiện'
    })
});

const getTransactionsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page phải là số',
        'number.integer': 'Page phải là số nguyên',
        'number.min': 'Page phải lớn hơn hoặc bằng 1'
    }),

    limit: Joi.number().integer().min(1).max(100).default(5).messages({
        'number.base': 'Limit phải là số',
        'number.integer': 'Limit phải là số nguyên',
        'number.min': 'Limit phải lớn hơn hoặc bằng 1',
        'number.max': 'Limit không được lớn hơn 100'
    })
});

const transferSchema = Joi.object({
    senderId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'SenderId không được để trống',
            'string.guid': 'SenderId không đúng định dạng UUID',
            'any.required': 'Vui lòng cung cấp senderId'
        }),

    recieverId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'RecieverId không được để trống',
            'string.guid': 'RecieverId không đúng định dạng UUID',
            'any.required': 'Vui lòng cung cấp recieverId'
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Số tiền muốn gửi phải là số',
            'number.positive': 'Số tiền muốn gửi phải lớn hơn 0',
            'any.required': 'Vui lòng cung cấp số tiền muốn gửi'
        })
});

module.exports = {
    updateBalanceSchema,
    getTransactionsSchema,
    transferSchema
}