const path = require('path');
const Client = require('shopify-buy');
const fetch = require('node-fetch');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const Constants = require('../../constants');
const Roles = require('../../server/constants/Roles');

const { ADMIN_ROLE_NAME } = Roles;

// Remote hooks
const adminRoleMappingCreator = require('../../server/hooks/adminRoleMappingCreator');

const CONTAINER_NAME = process.env.S3_BUCKET_NAME || 'test_container';

const client = Client.buildClient({
  storefrontAccessToken: process.env.SHOPIFY_TOKEN,
  domain: process.env.SHOPIFY_DOMAIN,
});

global.fetch = fetch;

module.exports = function (Admin) {
  // create a RoleMapping entry in the database
  // so that new admin user gets the right admin permissions
  Admin.afterRemote('create', adminRoleMappingCreator(ADMIN_ROLE_NAME));

  Admin.afterRemote('login', (ctx, tokenInstance, next) => {
    Admin.findById(tokenInstance.userId, (err, userInstance) => {
      if (err) {
        next(err);
      } else {
        tokenInstance.username = userInstance.username;
        next();
      }
    });
  });

  // TODO: fix this messy function
  Admin.getChipOrders = function (ctx, cb) {
    const allOrderChips = [];
    const desiredWorkerId = ctx.req.query.workerId;
    console.log(desiredWorkerId);
    // find all complete orderInfos with their related orderChips
    Admin.app.models.orderInfo.find({ where: { orderComplete: true } })
      .then((orderInfos) => {
        const promises = orderInfos.map((orderInfo) =>
          // find all orderChips related to each orderInfo
          Admin.app.models.orderChip.find({ where: { orderId: orderInfo.id } })
            .then((chipOrders) => {
              if (chipOrders !== null) {
                // append orderInfo.customerId to each orderChip instance
                const promisesInner = chipOrders.map((chipOrder) => {
                  chipOrder.customerId = orderInfo.customerId;
                  allOrderChips.push(chipOrder);
                });
                Promise.all(promisesInner).then(() => {
                  // Done appending everything
                });
              }
            })
            .catch((err) => {
              console.error(err);
              cb(err);
            }));

        // `promises` will not all resolve until `promisesInner` resolves
        Promise.all(promises).then(() => {
          // console.log(allOrderChips);
          const prom2 = allOrderChips.map((orderChip) => Admin.app.models.customer.findById(orderChip.customerId)
            .then((customer) => {
              orderChip.customerName = `${customer.firstName} ${customer.lastName}`;
            })
            .catch((err) => {
              console.error(err);
              cb(err);
            }));

          Promise.all(prom2).then(() => {
            const prom3 = allOrderChips.map((orderChip) => Admin.app.models.foundryWorker.findById(orderChip.workerId)
              .then((worker) => {
                if (worker) {
                  orderChip.workerName = `${worker.firstName} ${worker.lastName}`;
                } else {
                  orderChip.workerName = 'Not yet assigned';
                }
              })
              .catch((err) => {
                console.error(err);
                cb(err);
              }));

            Promise.all(prom3).then(() => {
              cb(null, allOrderChips);
            });
          });
        });
      })
      .catch((err) => {
        cb(err);
      });
  };

  Admin.remoteMethod('getChipOrders', {
    description: 'CUSTOM METHOD: Get all chip orders',
    accepts: [
      { arg: 'ctx', type: 'object', http: { source: 'context' } },
    ],
    http: { path: '/orderChips', verb: 'get' },
    returns: [{ arg: 'orderChips', type: 'array' }],
  });

  // Admin retrieve all orders
  // Using GET /orders (advanced filters can also be used)

  // Admin retrieves orders belongs to a certain worker
  // Using: GET /foundryWorkers/{id}/workerHasOrderInfos (Filters can also be used at the same time)
  // Frontend needs to pass customer id to backend

  // Admin retrieves orders belongs to a certain customer
  // Using:  GET /customers/{id}/workerHasOrderInfos (Filters can also be used at the same time)
  // Frontend needs to pass customer id to backend

  // Admin retrieve files belongs to a certain customer
  // Using: GET /customers/{id}/customerHasFiles
  // Frontend needs to pass customer id to backend

  Admin.downloadFile = function (ctx, cb) {
    const { fileId } = ctx.req.query;
    if (fileId === undefined || fileId === '') {
      const error = new Error('Missing fileId argument');
      error.status = 400;
      cb(error);
    } else {
      Admin.app.models.fileInfo.findById(fileId, (err, file) => {
        if (err) {
          console.error(`Error getting file: ${err}`);
          cb(err);
        } else if (file === null) {
          const error = new Error('File not found');
          error.status = 404;
          cb(error);
        } else {
          ctx.res.set('Content-Disposition', `inline; filename="${file.fileName}"`); // this sets the file name
          Admin.app.models.container.download(CONTAINER_NAME, file.containerFileName, ctx.req, ctx.res, (err, fileData) => {
            if (err) {
              cb(err);
            } else {
              cb(null);
            }
          });
        }
      });
    }
  };

  Admin.remoteMethod('downloadFile', {
    description: 'CUSTOM METHOD: Download a file',
    accepts: [
      { arg: 'ctx', type: 'object', http: { source: 'context' } },
    ],
    http: { path: '/downloadFile', verb: 'get' },
    returns: [],
  });

  Admin.getApiToken = function (cb) {
    cb(null, {
      token: process.env.SHOPIFY_TOKEN,
      domain: process.env.SHOPIFY_DOMAIN,
    }, 'application/json');
  };

  Admin.remoteMethod('getApiToken', {
    description: 'CUSTOM METHOD: get Api key and domain',
    http: { path: '/getApi', verb: 'get' },
    returns: [{ arg: 'info', type: 'object' }],
  });

  Admin.returnAllItems = function (cb) {
    const productIds = [
      Constants.CONTROLSYSID,
      Constants.CONTROLSYSID5,
      Constants.CONTROLSYSID10,
      Constants.TESTBOARDID,
      Constants.TESTBOARDID5,
      Constants.TESTBOARDID10,
      Constants.UNIVEWODCHIPID,
      Constants.UNIVEWODCHIPID5,
      Constants.UNIVEWODCHIPID10,
    ];
    console.log(productIds);
    client.product.fetchMultiple(productIds)
      .then((res) => {
        
        cb(null, res);
      }).catch((err) => console.log(err));
  };

  Admin.remoteMethod('returnAllItems', {
    description: 'Custom Method: get all products',
    http: { path: '/getItems', verb: 'get' },
    returns: [{ arg: 'products', type: 'array' }],
  });

  Admin.returnOneItem = function (productId, cb) {
    client.product.fetch(productId)
      .then((res) => {
        cb(null, res);
      }).catch((err) => console.log(err));
  };

  Admin.remoteMethod('returnOneItem', {
    description: 'Custom Method: get one product',
    http: { path: '/getOne', verb: 'get' },
    accepts: { arg: 'productId', type: 'string' },
    returns: [{ arg: 'product', type: 'object' }],
  });
};
