
const CONTAINER_NAME = process.env.S3_BUCKET_NAME || 'test_container';

module.exports = function(FoundryWorker) {
  FoundryWorker.afterRemote('login', (ctx, tokenInstance, next) => {
    FoundryWorker.findById(tokenInstance.userId, (err, userInstance) => {
      if (err) {
        next(err);
      } else {
        tokenInstance.username = userInstance.username;
        next();
      }
    });
  });

  FoundryWorker.prototype.getChipOrders = function(ctx, req, cb) {
    const foundryWorker = this;
    let allOrderChips = [];
    foundryWorker.workerOrders({})
      .then((chipOrders) => {
        const promises = chipOrders.map((chipOrder, index) => {
          // console.log(chipOrder);
          if (chipOrder.workerId === req.accessToken.userId) {
            return FoundryWorker.app.models.orderInfo.findById(chipOrder.orderId)
              .then((orderInfo) => {
                chipOrder.customerId = orderInfo.customerId;
                allOrderChips = allOrderChips.concat(chipOrder);
              })
              .catch((err) => {
                console.error(err);
                cb(err);
              });
          }
          console.log('Unmatched chip Order with current worker');
          const err = new Error('Unmatched chip Order with current worker');
          err.status = '403';
          cb(err);
        });
        Promise.all(promises).then(() => {
          const promises2 = allOrderChips.map((orderChip, index) => FoundryWorker.app.models.customer.findById(orderChip.customerId)
            .then((customer) => {
              orderChip.customerName = `${customer.firstName} ${customer.lastName}`;
            })
            .catch((err) => {
              console.error(err);
              cb(err);
            }));
          Promise.all(promises2).then(() => {
            cb(null, allOrderChips);
          });
        });
      })
      .catch((err) => {
        cb(err);
      });
  };

  FoundryWorker.remoteMethod('prototype.getChipOrders', {
    description: 'CUSTOM METHOD: Get all chip orders',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    http: {path: '/orderChips', verb: 'get'},
    returns: [{arg: 'orderChips', type: 'array'}],
  });

  FoundryWorker.prototype.downloadFile = function(ctx, cb) {
    // download file for a given chipOrderId
    const {chipOrderId} = ctx.req.query;
    const user = this;
    if (chipOrderId === undefined || chipOrderId === '') {
      const error = new Error('Missing chipOrderId argument');
      error.status = 400;
      cb(error);
    } else {
      console.log(chipOrderId);
      FoundryWorker.app.models.orderChip.findById(chipOrderId, (err, chipOrder) => {
        if (err) {
          console.error(`Error getting chipOrder: ${err}`);
          cb(err);
        } else if (chipOrder === null) {
          const error = new Error('chipOrder not found');
          error.status = 404;
          cb(error);
        } else if (chipOrder.workerId !== user.id) {
          const error = new Error('Forbidden to access file');
          error.status = 403;
          cb(error);
        } else {
          // file exists and we're allowed to access it
          FoundryWorker.app.models.fileInfo.findById(chipOrder.fileInfoId, (err, file) => {
            if (err) {
              console.error(`Error getting file: ${err}`);
              cb(err);
            } else if (file === null) {
              const error = new Error('File not found');
              error.status = 404;
              cb(error);
            } else {
              ctx.res.set('Content-Disposition', `inline; filename="${file.fileName}"`); // this sets the file name
              FoundryWorker.app.models.container.download(CONTAINER_NAME, file.containerFileName, ctx.req, ctx.res, (err, fileData) => {
                if (err) {
                  cb(err);
                } else {
                  cb(null);
                }
              });
            }
          });
        }
      });
    }
  };

  FoundryWorker.remoteMethod('prototype.downloadFile', {
    description: 'CUSTOM METHOD: Download a file',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
    http: {path: '/downloadFile', verb: 'get'},
    returns: [],
  });
};
