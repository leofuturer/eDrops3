
const errors = require('../../server/toolbox/errors');

module.exports = function(OrderProduct) {
  OrderProduct.beforeRemote('**', (ctx, modelInstance, next) => {
    const productId = ctx.req.params.id;
    OrderProduct.app.models.AccessToken.findById(ctx.req.headers['x-edrop-userbase'], (err, token) => {
      if (err) {
        next(errors.notFound('user does not exist'));
      } 
      else {
        OrderProduct.app.models.userBase.findById(token.userId, (err, user) => {
          if(err) {
            next(err);
          } else {
            if (user.userType !== 'customer') {
              next(errors.forbidden('only customer can modify product order'));
            } else {
              OrderProduct.findById(productId, (err, product) => {
                // console.log(product);
                if (err) {
                  console.error(err);
                  next(err);
                } else {
                  OrderProduct.app.models.orderInfo.findOne({where: {id: product.orderId}}, (err, info) => {
                    // console.log(info);
                    // console.log(ctx.req.accessToken);
                    if (err) {
                      console.log(err);
                      next(err);
                    } else if (info.customerId !== ctx.req.accessToken.userId) {
                      next(errors.forbidden('customer id does not match with this order.'));
                    } else {
                      next();
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
    
  });
};
