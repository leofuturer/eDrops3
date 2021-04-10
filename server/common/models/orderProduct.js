
const errors = require('../../server/toolbox/errors');

module.exports = function(OrderProduct) {
  OrderProduct.beforeRemote('**', (ctx, modelInstance, next) => {
    const productId = ctx.req.params.id;
    OrderProduct.app.models.AccessToken.findById(ctx.req.headers['x-edrop-userbase'], (err, token) => {
      if (err) next(errors.notFound('user does not exist'));
      else {
        OrderProduct.app.models.userBase.findById(token.userId, (err, user) => {
          if (user.userType !== 'customer') next(errors.forbidden('only customer can modify product order'));
        });
      }
    });
    OrderProduct.findById(productId, (err, product) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        OrderProduct.app.models.orderInfo.findOne({where: {orderId: product.orderId}}, (err, info) => {
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
  });
};
