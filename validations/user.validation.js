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