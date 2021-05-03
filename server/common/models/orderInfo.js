
const checkOrderOwnership = require('../../server/hooks/checkOrderOwnership');
const errors = require('../../server/toolbox/errors');

module.exports = function(OrderInfo) {
  // Remote Methods

  // Caller: Shopify web hook, when an order is created
  // This hook is called when the order is paid for
  OrderInfo.newOrderCreated = (body, req, cb) => {
    console.log(`Shopify order creation webhook token: ${req.headers['x-shopify-hmac-sha256']}`);
    // console.log(body);
    console.log(`An order was just paid using email ${body.email}, receiving webhook info from Shopify`);
    // TODO: Verify the request came from Shopify
    if (body.checkout_token !== null) {
      OrderInfo.findOne({where: {checkoutToken: body.checkout_token}}, (err, orderInfoInstance) => {
        if (err) {
          cb(err);
        } else {
          const date = new Date();
          orderInfoInstance.updateAttributes({
            orderInfoId: body.id,
            orderStatusURL: body.order_status_url,
            orderComplete: true,
            status: 'Payment made',
            lastModifiedAt: date.toISOString(),

            fees_and_taxes: (parseFloat(body.total_price) - parseFloat(body.total_line_items_price)).toString(),
            subtotal_cost: (parseFloat(body.total_line_items_price)).toString(),
            total_cost: (parseFloat(body.total_price)).toString(),

            user_email: body.email,

            sa_name: `${body.shipping_address.first_name} ${body.shipping_address.last_name}`,
            sa_address1: body.shipping_address.address1,
            sa_address2: body.shipping_address.address2,
            sa_city: body.shipping_address.city,
            sa_province: body.shipping_address.province,
            sa_zip: body.shipping_address.zip,
            sa_country: body.shipping_address.country,

            ba_name: `${body.billing_address.first_name} ${body.billing_address.last_name}`,
            ba_address1: body.billing_address.address1,
            ba_address2: body.billing_address.address2,
            ba_city: body.billing_address.city,
            ba_province: body.billing_address.province,
            ba_zip: body.billing_address.zip,
            ba_country: body.billing_address.country,
          });
          cb(null);
        }
      });
    } else {
      cb(null);
    }
  };

  OrderInfo.prototype.addOrderChipToCart = (body, req, cb) => {
    // console.log(body);
    // Find the specified orderInfo (top level)
    OrderInfo.findById(body.orderInfoId, (err, orderInfo) => {
      if (err) {
        console.error(err);
        cb(err);
      } else {
        // console.log(orderInfo);
        // Then see if product order already created, if we need to create one
        OrderInfo.app.models.AccessToken.findById(req.headers['x-edrop-userbase'], (err, token) => {
          if (err) {
            console.log(err);
            cb(err);
          } else {
            OrderInfo.app.models.userBase.findById(token.userId, (err, user) => {
              if (err) cb(err);
              else if (user.userType !== 'customer') {
                console.log('only customer can add chip to cart');
                cb(errors.forbidden('only customer can add chip to cart'));
              }
            });
          }
        });
        if (orderInfo.customerId !== req.accessToken.userId) {
          console.log('customer and order info does not match');
          cb(null);
        } else {
          orderInfo.orderChips({where: {variantIdShopify: body.variantIdShopify, otherDetails: body.otherDetails}}, (err, orderChips) => {
            // variant ID should uniquely identify it
            // console.log(orderProducts);
            if (err || orderChips.length > 1) {
              console.error('Error occurred or more than one entry for product');
              console.error(err);
              cb(err);
            }
            // not present, need to create a new one
            else if (orderChips.length === 0) {
              orderInfo.orderChips.create(body, (err, orderChip) => {
                // console.log(orderProduct);
                if (err) {
                  console.error(err);
                  cb(err);
                } else {
                  console.log(`Created orderChips with product order id ${orderChip.id}, product ${orderChip.description}`);
                  cb(null);
                }
              });
            } else if (orderChips.length === 1) { // already exists
              const newQtyData = {
                quantity: orderChips[0].quantity + body.quantity,
              };
              orderChips[0].updateAttributes(newQtyData, (err, orderChip) => {
                // console.log(orderProduct);
                if (err) {
                  console.error(err);
                  cb(err);
                } else {
                  console.log(`Updated quantity to ${orderChip.quantity} for product order ID: ${orderChip.id}, product ${orderChip.description}`);
                  cb(null);
                }
              });
            }
          });
        }
      }
    });
  };

  // This function:
  // (1) Updates the specified order with given ID (represents customer's cart)
  // (2) Searches if the appropriate item is already in the customer's cart
  //      If so, update quantity; if not, create item and then add to cart
  // (3) Returns success/failure
  OrderInfo.prototype.addOrderProductToCart = (body, req, cb) => {
    // console.log(body);
    // Find the specified orderInfo (top level)
    OrderInfo.findById(body.orderInfoId, (err, orderInfo) => {
      if (err) {
        console.error(err);
        cb(err);
      } else {
        // console.log(orderInfo);
        // Then see if product order already created, if we need to create one
        OrderInfo.app.models.AccessToken.findById(req.headers['x-edrop-userbase'], (err, token) => {
          if (err) {
            console.log(err);
            cb(err);
          } else {
            OrderInfo.app.models.userBase.findById(token.userId, (err, user) => {
              if (err) cb(err);
              else if (user.userType !== 'customer') {
                console.log('only customer can add chip to cart');
                cb(null);
              }
            });
          }
        });
        if (orderInfo.customerId !== req.accessToken.userId) {
          console.log('customer and order info does not match');
          cb(null);
        } else {
          orderInfo.orderProducts({where: {variantIdShopify: body.variantIdShopify, otherDetails: body.otherDetails}}, (err, orderProducts) => {
            // variant ID should uniquely identify it
            // console.log(orderProducts);
            if (err || orderProducts.length > 1) {
              console.error('Error occurred or more than one entry for product');
              console.error(err);
              cb(err);
            }
            // not present, need to create a new one
            else if (orderProducts.length === 0) {
              orderInfo.orderProducts.create(body, (err, orderProduct) => {
                // console.log(orderProduct);
                if (err) {
                  console.error(err);
                  cb(err);
                } else {
                  console.log(`Created orderProduct with product order id ${orderProduct.id}, product ${orderProduct.description}`);
                  cb(null);
                }
              });
            } else if (orderProducts.length === 1) { // already exists
              const newQtyData = {
                quantity: orderProducts[0].quantity + body.quantity,
              };
              orderProducts[0].updateAttributes(newQtyData, (err, orderProduct) => {
                // console.log(orderProduct);
                if (err) {
                  console.error(err);
                  cb(err);
                } else {
                  console.log(`Updated quantity to ${orderProduct.quantity} for product order ID: ${orderProduct.id}, product ${orderProduct.description}`);
                  cb(null);
                }
              });
            }
          });
        }
      }
    });
  };

  OrderInfo.beforeRemote('findById', (ctx, modelInstance, next) => {
    console.log(`Fetching order info with id=${ctx.req.params.id}`);
    const userbaseToken = ctx.req.headers['x-edrop-userbase'];
    OrderInfo.app.models.AccessToken.findById(userbaseToken, (err, token) => {
      // check it's admin or customer retrieving order info
      if (err) next(err);
      else {
        OrderInfo.app.models.userBase.findById(token.userId, (err, user) => {
          if (user.userType !== 'customer' && user.userType !== 'admin') {
            next(errors.forbidden('only customer or admin can retrieve order info'));
          } else if (user.userType === 'admin'){
              // admin can access any orderInfo model
              next(); 
          } else {
            // check customer actually owns this orderInfo
            OrderInfo.findById(ctx.req.params.id, (err, info) => {
              if (err) {
                console.error(err);
                next(err);
              } else if (ctx.req.accessToken.userId !== info.customerId) {
                next(errors.forbidden('this order is not owned by you'));
              } else {
                next();
              }
            });
          }
        });
      }
    });
  });

  OrderInfo.beforeRemote('prototype.__get__orderProducts', (ctx, modelInstance, next) => {
    checkOrderOwnership(ctx, modelInstance, next, true);
  });

  OrderInfo.beforeRemote('prototype.__get__orderChips', checkOrderOwnership);

  OrderInfo.afterRemote('prototype.__get__orderChips', (ctx, modelInstance, next) => {
    OrderInfo.app.models.AccessToken.findById(ctx.req.headers['x-edrop-userbase'], (err, token) => {
      if (err) next(err);
      else {
        OrderInfo.app.models.userBase.findById(token.userId, (err, user) => {
          if (err) next(err);
          else if (user.userType === 'worker') {
            if (ctx.result) {
              if (Array.isArray(ctx.result)) {
                ctx.result.forEach((element, index) => {
                  if (element.workerId !== ctx.req.accessToken.userId) {
                    ctx.result.splice(index, 1);
                  }
                });
              }
            }
          }
        });
        next();
      }
    });
  });

  OrderInfo.remoteMethod('prototype.addOrderProductToCart', {
    description: 'CUSTOM METHOD: Add product order to cart (increase quantity)',
    accepts: [
      {arg: 'body', type: 'object', http: {source: 'body'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    http: {path: '/addOrderProductToCart', verb: 'post'},
    returns: [],
  });

  OrderInfo.remoteMethod('prototype.addOrderChipToCart', {
    description: 'CUSTOM METHOD: Add chip order to cart (increase quantity)',
    accepts: [
      {arg: 'body', type: 'object', http: {source: 'body'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    http: {path: '/addOrderChipToCart', verb: 'post'},
    returns: [],
  });

  OrderInfo.remoteMethod('newOrderCreated', {
    description: 'An Order (customer has paid) was created by Shopify',
    accepts: [
      {arg: 'body', type: 'object', http: {source: 'body'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    http: {path: '/newOrderCreated', verb: 'post'},
    returns: {arg: 'msg', type: 'string'},
  });
};
