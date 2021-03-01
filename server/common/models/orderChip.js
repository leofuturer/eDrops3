'use strict';

const errors = require('../../server/toolbox/errors');

module.exports = function(OrderChip) {
    OrderChip.beforeRemote('**', function(ctx, modelInstance, next){
      let chipId = ctx.req.params.id;
      OrderChip.app.models.AccessToken.findById(ctx.req.headers['x-edrop-userbase'], function(err, token){
        if(err) {
          err.status = "404";
          next(err);
        }
        else{
          OrderChip.app.models.userBase.findById(token.userId, function(err, user){
            if(err){
              err.status = "404";
              next(err);
            }
            else{
              let userType = user.userType;
              OrderChip.findById(chipId, function(err, chip){
                if(err) next(err);
                else if(userType ==='worker' && chip.workerId !== ctx.req.accessToken.userId){
                  console.error('worker and chip order does not match');
                  next(errors.forbidden("worker and chip order does not match"));
                }else if(userType ==='customer'){
                  OrderChip.app.models.orderInfo.findOne({where: {orderId: chip.orderId}}, (err, info)=>{
                    if(err) next(err);
                    else if(info.customerId !== ctx.req.accessToken.userId){
                      console.error('user and chip order does not match');
                      next(errors.forbidden("user and chip order does not match"));
                    }else{
                      next();
                    }
                  })
                }else{
                  next();
                }
              });
            }
          });
        }
      });
    });
};
