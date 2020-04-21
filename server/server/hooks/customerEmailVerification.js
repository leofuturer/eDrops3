const path = require('path');
const { ADMIN_EMAIL } = require('../constants/emailconstants');

'use strict';

module.exports = async (ctx, customerInstance, next) => {

    const { customer } = ctx.req.app.models;
    const { email } = ctx.req.body;
    const senderAddress = ADMIN_EMAIL;
    await customerInstance.updateAttribute('emailVerified', 1);
    /*
    var options = {
        type: 'email',
        to: email,
        from: senderAddress,
        subject: 'Email Verification from Edrop',
        text: `Hello ${customerInstance.username}!\n Thanks a lot for your registeration! \n Please verify your email by clicking it:`,
        template: path.resolve(__dirname, '../views/verify.ejs'),
        redirect: '/verified'
      };
      
      customerInstance.verify(options, function(err, res) {
        if (err) {
          customer.deleteById(customerInstance.id);
          return next(err);
        }
        ctx.res.render('response', {
          title: 'Signed up successfully',
          content: 'Please check your email and click on the verification link ' +
              'before logging in.',
          redirectTo: '/home',
          redirectToLinkText: 'Log in'
        });
    });
    */
};