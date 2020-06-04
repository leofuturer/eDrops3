'use strict'

const errors = require('../toolbox/errors');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

module.exports = (ctx, unset, next) => {
    const { password } = ctx.req.body;
    const { confirmPassword } = ctx.req.body;

    if(!passwordRegex.test(String(password))){
        return next(errors.validationError('Password does not meet security requirements'));
    }

    return next();
};