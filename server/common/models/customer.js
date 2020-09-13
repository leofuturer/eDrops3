const customerEmailVerification = require("../../server/hooks/customerEmailVerification");
const passwordValidation = require("../../server/hooks/passwordValidation");
const app = require("../../server/server.js");
const { FRONTEND_HOSTNAME, FRONTEND_PORT, SENDER_EMAIL_USERNAME } = require('../../server/constants/emailconstants');
const path = require('path');
const errors = require('../../server/toolbox/errors');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const log = require('../../db/toolbox/log');

module.exports = function(Customer) {
    //validate security of password(at least 8 digits, include at least one uppercase
    //one lowercase, one number)
    Customer.beforeRemote('create', passwordValidation);

    // create default address for user
    Customer.afterRemote('create', function(ctx, customerInstance, next){
        //for the future: can probably move this function to its own js file
        console.log(customerInstance);
        //copy over the address data
        //if possible, we should only pass in the customer data to the creation
        //of the customer model too
        const { customer } = ctx.req.app.models;
        let addressData = { //default fields for if any are blank
            street: ctx.result.address || "Not provided during signup",
            city: ctx.result.city || "Not provided during signup",
            state: ctx.result.state || "Not provided during signup",
            zipCode: ctx.result.zipCode || "Not provided during signup",
            country: ctx.result.country || "Not provided during signup",
            isDefault: true //only occurs when a new customer is created
        }
        log.info("Customer instance created, now associating address with it");
        customerInstance.customerAddresses.create(addressData, (err, addressInstance) =>{
            if(err){
                //roll back the customer creation
                customer.deleteById(customerInstance.id);
                console.log(err);
            }
            else{
                //next: send verification email
                next();
            }
        });
    });

    //send verification email after registration and address creation
    Customer.afterRemote('create', customerEmailVerification);

    Customer.prototype.resendVerifyEmail = function(options, cb){
        //we use .prototype because this is an instance method
        console.log(options);
        const user = this;
        console.log(user.id);
        var emailOptions = {
            type: 'email',
            from: SENDER_EMAIL_USERNAME,
            subject: '[Edrop] Resent Email Verification',
            text: `Hello ${user.firstName} ${user.lastName}! Here's another email verification link that you requested.`,
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            host: FRONTEND_HOSTNAME,
            port: FRONTEND_PORT,
            redirect: '/emailVerified'
        };
        
        user.verify(emailOptions);
        cb(null);
    }

    Customer.beforeRemote('setPassword', function(ctx, customerInstance, next){
        // this is called before password is reset with /customers/reset-password
        if(!passwordRegex.test(ctx.req.body.newPassword)){
            next(errors.validationError('Password does not meet security requirements'));
        }
        else{
            next();
        }
    })

    Customer.on('resetPasswordRequest', function(info){
        // from https://loopback.io/doc/en/lb3/Logging-in-users.html
        var url = `http://${FRONTEND_HOSTNAME}:${FRONTEND_PORT}/resetPassword`;
        var html = `Hello ${info.user.firstName} ${info.user.lastName},<br><br>` + 
                    `You've requested a password reset. Please click <a href="${url}?access_token=` + 
                    `${info.accessToken.id}">here</a> to reset your password. ` + 
                    `This link will expire in 15 minutes.<br><br>` + 
                    `Sincerely,<br>` + 
                    `Edrop<br><br>` + 
                    `Need help? Contact us at ${SENDER_EMAIL_USERNAME}<br>`;
        Customer.app.models.Email.send({
            to: info.email,
            from: SENDER_EMAIL_USERNAME,
            subject: '[Edrop] Password Reset Request',
            html: html
        }, function(err) {
            if (err) return console.log('> Error sending password reset email');
            console.log('> Sending password reset email to:', info.email);
        });
    })

    //Customer instance creates an address belongsTo himself 
    //Actually we do not need this, we should use the exposed API below for model relation instead.
    //Using: POST /customers/{id}/orders
    Customer.createAddress = (ctx, body) => {
        const data = {};
        data.street = ctx.req.body.street;
        data.city = ctx.req.body.city;
        data.state = ctx.req.body.state;
        data.country = ctx.req.body.country;
        data.zipCode = ctx.req.body.zipCode;
        data.isDefault = ctx.req.body.isDefault;
        currentCustomerId = ctx.req.accessToken.userId;
        console.log(ctx.req.body);
        Customer.findById(currentCustomerId, (err, customerInstance) => {
            customerInstance.customerAddresses.create(data, (err, addressInstance) => {
                if(err){
                    console.error(err);
                }
                else{
                    return addressInstance;
                }
            });
        });
    }

    Customer.prototype.getCustomerCart = function(cb) {
        const customer = this;
        customer.customerOrders({"where": {"orderComplete": false}}, function(err, orders) {
            if(err || orders.length > 1){
                console.log(`Error getting customer cart or there's more than one active cart: ${err}`);
                var error = new Error(`Error while querying for customer cart`);
                cb(error);
            }
            else if(orders.length === 0){
                console.log(`No cart found for customer id=${customer.id}, need to create one`);
                cb(null, 0); //return id = 0 for "false"
            }
            else{
                console.log(`Cart already exists, is order info model with id ${orders[0].id}`);
                cb(null, orders[0].id, orders[0].checkoutIdClient, orders[0].checkoutLink);
            }
        });
    }

    // Remote methods
    Customer.remoteMethod('prototype.getCustomerCart', {
        description: 'CUSTOM METHOD: Get ID of orderInfo that represents customers cart; if not present, returns 0',
        accepts: [],
        http: {path: '/getCustomerCart', verb: 'get'},
        returns: [
            {arg: 'id', type: 'number'},
            {arg: 'checkoutIdClient', type: 'string'},
            {arg: 'checkoutLink', type: 'string'},
        ]
    });

    // Customer resends verification email
    // Using: POST /customers/{id}/resendEmail
    Customer.remoteMethod('prototype.resendVerifyEmail',{
        description: 'CUSTOM METHOD: resend verification email, use this instead of /verify',
        accepts: [
            {arg: 'options', type: 'object', http: 'optionsFromRequest'},
        ],
        http: {verb: 'post'},
    });

    Customer.remoteMethod('createAddress', {
        discription: 'Customer adds another address',
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'body', type: 'object', http: {source: 'body'}},
            
        ],
        http: {path: '/createAddress', verb: 'post'},
        returns: {arg: 'addressInstance', type: 'object', root: true}
    });
}
