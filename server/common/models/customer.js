const customerEmailVerification = require("../../server/hooks/customerEmailVerification");
const passwordValidation = require("../../server/hooks/passwordValidation");
const app = require("../../server/server.js");
module.exports = function(Customer) {

    //validate security of password(at least 8 digits, include at least one uppercase
    //one lowercase, one number)
    Customer.beforeRemote('create', passwordValidation);

    // create default address for user
    Customer.afterRemote('create', function(ctx, customerInstance, next){
        //for the future: can probably move this functino to its own js file

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
    
    //Remote methods

    //Customer instance creates an address belongsTo himself 
    //Actually we do not need this, we should use the exposed API below for model relation instead.
    //Using: POST /customers/{id}/orders
    Customer.createAddress = ( ctx, body) => {
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
                    console.log(err);
                }
                else{
                    return addressInstance;
                }
            });
        });
    }

    Customer.remoteMethod('createAddress', {
        discription: 'Customer adds another address',
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        http: {path: '/createAddress', verb: 'post'},
        returns: {arg: 'addressInstance', type: 'object', root: true}
    });

    //Customer instance retrieves his orders
    //Using:    GET /customers/{id}/CustomerHasOrderInfos (Filters can also be used at the same time)
    //Frontend needs to pass customer id to backend

    //Customer instance retireves his files
    //Using: GET /customers/{id}/customerHasFiles
    //Frontend needs to pass customer id to backend
    
    //Customer delete his files
    //Using DELETE /customers/{id}/customerHasFiles/{fk}
    //Frontend needs to pass customer id & file id
}
