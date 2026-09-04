const Joi = require('joi');
const registerSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Họ tên không được để trống',
        'string.min': 'Họ tên phải có ít nhất 3 ký tự',
        'any.required': 'Vui lòng cung cấp họ tên'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không đúng định dạng',
        'any.required': 'Vui lòng cung cấp email'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Vui lòng cung cấp mật khẩu'
    }),
    role: Joi.number().integer().min(1).max(3).default(1).messages({
            'number.base': 'Role phải là số',
            'number.integer': 'Role phải là số nguyên',
            'number.min': 'Role phải lớn hơn hoặc bằng 1 (1: Admin, 2: Staff, 3: User)',
            'number.max': 'Role phải bé hơn hoặc bằng 3 (1: Admin, 2: Staff, 3: User)'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không đúng định dạng',
        'any.required': 'Vui lòng cung cấp email'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Vui lòng cung cấp mật khẩu'
    })
});

module.exports = {
    registerSchema,
    loginSchema
};