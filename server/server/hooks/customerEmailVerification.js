const path = require('path');
const {FRONTEND_HOSTNAME, FRONTEND_PORT} = require('../constants/emailconstants');

'use strict';

module.exports = (ctx, customerInstance, next) => {
  const {customer} = ctx.req.app.models;
  const {email} = ctx.req.body;

  // uncomment line below to bypass email verification
  // customerInstance.updateAttribute('emailVerified', 1);

  // console.log(ctx.req);
  const options = {
    type: 'email',
    to: email,
    from: process.env.APP_EMAIL_USERNAME,
    subject: '[Edrop] Email Verification',
    text: `Hello ${customerInstance.username}! Thanks for registering to use Edrop. Please verify your email by clicking on the following link:`,
    template: path.resolve(__dirname, '../views/verify.ejs'),
    protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
    host: FRONTEND_HOSTNAME,
    port: FRONTEND_PORT,
    redirect: '/emailVerified',
  };

  customerInstance.verify(options, (err, res) => {
    if (err) {
      // email sending failed, so don't create customer
      customer.deleteById(customerInstance.id);
      return next(err);
    }
    ctx.res.send({message: 'Signup successful!'});
    // can change this in the future with some other send method:
    // https://expressjs.com/en/api.html#res.send
  });
};
