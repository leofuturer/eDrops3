
const errors = require('../../server/toolbox/errors');

module.exports = function(OrderChip) {
  OrderChip.beforeRemote('**', (ctx, modelInstance, next) => {
    const chipId = ctx.req.params.id;
    OrderChip.app.models.AccessToken.findById(ctx.req.headers['x-edrop-userbase'], (err, token) => {
      if (err) {
        err.status = '404';
        next(err);
      } else {
        OrderChip.app.models.userBase.findById(token.userId, (err, user) => {
          if (err) {
            err.status = '404';
            next(err);
          } else {
            const {userType} = user;
            OrderChip.findById(chipId, (err, chip) => {
              if (err) next(err);
              else if (userType === 'worker' && chip.workerId !== ctx.req.accessToken.userId) {
                console.error('worker and chip order does not match');
                next(errors.forbidden('worker and chip order does not match'));
              } else if (userType === 'customer') {
                OrderChip.app.models.orderInfo.findOne({where: {id: chip.orderId}}, (err, info) => {
                  if (err) next(err);
                  else if (info.customerId !== ctx.req.accessToken.userId) {
                    console.error('user and chip order does not match');
                    console.error(`customerId: ${info.customerId}, token ID: ${ctx.req.accessToken.userId}`);
                    next(errors.forbidden('user and chip order does not match'));
                  } else {
                    next();
                  }
                });
              } else {
                next();
              }
            });
          }
        });
      }
    });
  });
};
