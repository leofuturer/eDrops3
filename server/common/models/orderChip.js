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
              })
            }
          })
        }
      })
    })
    // Method below redundant, just use PATCH /orderChips/{id}
    // /*  OrderChip assignment
    // *   para: OrderInfoKey: the primary key generated by loopback instead of the OrderInfoId from shopify
    // *         workerId: the id property of worker instance
    // */
    // OrderChip.assignOrderInfo = function(orderId, workerId, cb){
    //     console.log(`Assigning order ${orderId} to worker ${workerId}`);
    //     OrderChip.findById(orderId)
    //     .then(order => {
    //         order.updateAttributes({workerId: workerId}, function(err, instance){
    //             if(err){
    //                 console.error(err);
    //                 cb(err);
    //             } else {
    //                 // console.log(instance);
    //                 cb(null, instance);
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         cb(err);
    //     });
    // }

    // OrderChip.remoteMethod('assignOrderInfo', {
    //     description: 'Admin assign chip order to foundry worker.',
    //     accepts: [
    //         {arg: 'orderId', type: 'number', http: {source: 'form'}},
    //         {arg: 'workerId', type: 'number', http: {source: 'form'}}
    //     ],
    //     returns: {arg: 'orderChip', type: 'object'},
    //     http: {path: '/assignOrderChip', verb: 'post'}
    // });


};
