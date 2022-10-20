const Joi = require('joi');

const signupSchema = Joi.object({

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required(),

    number: Joi.string()
        .pattern(/^[0-9\w+]{13}$/).messages({ 'string.pattern.base': 'Phone number format  must be  "+countrycode-10 digits".' })
        .required(),
});

const loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required(),
});
const emailVerifySchema = Joi.object({

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    otp: Joi.string()
        .required(),
});
const phoneVerifySchema = Joi.object({

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    otp: Joi.string()
        .required(),
    number: Joi.string()
        .pattern(/^[0-9\w+]{13}$/).messages({ 'string.pattern.base': 'Phone number format  must be  "+countrycode-10 digits".' })
        .required(),
});

const forgetPasswordSchema = Joi.object({

    email: Joi.string()
        .email()
        .lowercase()
        .required(),
});
const resetPasswordSchema = Joi.object({

    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    newPassword: Joi.string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required(),

    confirmPassword: Joi.ref('newPassword'),

    otp: Joi.string()
        .required(),
});

module.exports = {
    signupSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, emailVerifySchema, phoneVerifySchema,
};
