const errors = require('../toolbox/errors');

// function testPassword(password) {
//   let lenCheck = password.length >= 8;
//   let upperCheck = password.match(/[A-Z]/) != null;
//   let lowerCheck = password.match(/[a-z]/) != null;
//   let digitCheck = password.match(/[0-9]/) != null;
//   let singleWordCheck = password.match(/\s/) == null;
//   return lenCheck && upperCheck && lowerCheck && digitCheck && singleWordCheck;
// }

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;

module.exports = (ctx, unset, next) => {
  const { password } = ctx.req.body;

  if (!passwordRegex.test(String(password))) {
    return next(errors.validationError('Password does not meet security requirements'));
  }

  return next();
};
