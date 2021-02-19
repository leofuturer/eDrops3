'use strict';

const errors = require('../toolbox/errors');
const app = require("../server");

module.exports = (ctx, modelInstance, next, product = false) => {
  const OrderInfo = app.models.orderInfo;
  const UserBase = app.models.userBase;
  const AccessToken = app.models.AccessToken;
  AccessToken.findById(ctx.req.headers['x-edrop-userbase'], function(err, token){
    if(err) next(err);
    else {
      UserBase.findById(token.userId, function(err, user){
        if(err) next(err);
        else if(product && user.userType !== 'customer') next(errors.forbidden('only customer owns product'));
        else if(user.userType === 'customer') {
          OrderInfo.findById(ctx.req.params.id, function(err, info){
            if(err) next(err);
            else if(info.customerId !== ctx.req.accessToken.userId) {
              next(errors.forbidden('customer and order does not match'));
            }else{
              next();
            }
          })
        }else{
          next();
        }
      })
    }
  })
}
