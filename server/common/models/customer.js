const customerEmailVerification = require("../../server/hooks/customerEmailVerification");
const passwordValidation = require("../../server/hooks/passwordValidation");
const app = require("../../server/server.js");
module.exports = function(Customer) {

  //validate security of password(at least 8 digits, include at least one uppercase
  //one lowercase, one number)
  Customer.beforeRemote('create', passwordValidation);

  //send verification email after registration
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
    currentCustomerId = ctx.req.accessToken.userId;

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
  //Using:  GET /customers/{id}/CustomerHasOrderInfos (Filters can also be used at the same time)
  //Frontend needs to pass customer id to backend

  //Customer instance retireves his files
  //Using: GET /customers/{id}/customerHasFiles
  //Frontend needs to pass customer id to backend
  
  //Customer delete his files
  //Using DELETE /customers/{id}/customerHasFiles/{fk}
  //Frontend needs to pass customer id & file id
}