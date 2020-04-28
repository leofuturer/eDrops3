const path = require('path');
const { FRONTEND_HOSTNAME, FRONTEND_PORT, SENDER_EMAIL_USERNAME } = require('../constants/emailconstants');

'use strict';

module.exports = (ctx, customerInstance, next) => {
        const { customer } = ctx.req.app.models;
        const { email } = ctx.req.body;
        // customerInstance.updateAttribute('emailVerified', 1);
        // console.log(ctx.req);
        var options = {
                type: 'email',
                to: email,
                from: SENDER_EMAIL_USERNAME,
                subject: '[Edrop] Email Verification',
                text: `Hello ${customerInstance.username}! Thanks for registering to use Edrop. Please verify your email by clicking on the following link:`,
                template: path.resolve(__dirname, '../views/verify.ejs'),
                host: FRONTEND_HOSTNAME,
                port: FRONTEND_PORT,
                redirect: '/home'
            };
            
            customerInstance.verify(options, function(err, res) {
                if (err) {
                    customer.deleteById(customerInstance.id);
                    return next(err);
                }
                ctx.res.render('response', {
                    // uses response.ejs, this response gets sent back after the POST
                    // but it's currently not used for anything
                    title: 'Signed up successfully',
                    content: 'Please check your email and click on the verification link ' +
                            'before logging in.',
                    redirectTo: '/home',
                    redirectToLinkText: 'Log in'
                });
        });      
};
