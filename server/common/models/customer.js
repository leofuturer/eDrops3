const path = require('path');
const customerEmailVerification = require('../../server/hooks/customerEmailVerification');
const passwordValidation = require('../../server/hooks/passwordValidation');
const app = require('../../server/server.js');
const {FRONTEND_HOSTNAME, FRONTEND_PORT} = require('../../server/constants/emailconstants');
const log = require('../../db/toolbox/log');
const {formatBytes, currentTime} = require('../../server/toolbox/calculate');
require('dotenv').config({path: path.resolve(__dirname, '.env')});

const CONTAINER_NAME = process.env.S3_BUCKET_NAME || 'test_container';

module.exports = function(Customer) {
  // validate security of password(at least 8 digits, include at least one uppercase
  // one lowercase, one number)
  Customer.beforeRemote('create', passwordValidation);

  // create default address for user
  Customer.afterRemote('create', (ctx, customerInstance, next) => {
    // for the future: can probably move this function to its own js file
    // log(customerInstance);
    // copy over the address data
    // if possible, we should only pass in the customer data to the creation
    // of the customer model too
    const {customer} = ctx.req.app.models;
    const addressData = { // default fields for if any are blank
      street: ctx.result.address || 'Not provided during signup',
      city: ctx.result.city || 'Not provided during signup',
      state: ctx.result.state || 'Not provided during signup',
      zipCode: ctx.result.zipCode || 'Not provided during signup',
      country: ctx.result.country || 'Not provided during signup',
      isDefault: true, // only occurs when a new customer is created
    };
    log.info('Customer instance created, now associating address with it');
    customerInstance.customerAddresses.create(addressData, (err, addressInstance) => {
      if (err) {
        // roll back the customer creation
        customer.deleteById(customerInstance.id);
        console.error(err);
      } else {
        // next: send verification email
        next();
      }
    });
  });

  Customer.afterRemote('login', (ctx, tokenInstance, next) => {
    Customer.findById(tokenInstance.userId, (err, userInstance) => {
      if (err) {
        next(err);
      } else {
        tokenInstance.username = userInstance.username;
        next();
      }
    });
  });

  // send verification email after registration and address creation
  Customer.afterRemote('create', customerEmailVerification);

  Customer.resendVerifyEmail = function(body, cb) {
    Customer.find({where: {email: body.email}}, (err, users) => {
      if (err) {
        console.error(err);
        cb(err);
      } else if (users.length > 1) {
        const err = new Error('more than one user found with that email');
        cb(err);
      } else {
        const user = users[0];
        const emailOptions = {
          type: 'email',
          from: process.env.APP_EMAIL_USERNAME,
          subject: '[eDrops] Resent Email Verification',
          text: `Hello ${user.firstName} ${user.lastName}! Here's another email verification link that you requested.`,
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
          host: FRONTEND_HOSTNAME,
          port: FRONTEND_PORT,
          redirect: '/emailVerified',
        };

        user.verify(emailOptions);
        cb(null);
      }
    });
  };

  // Customer instance creates an address belongsTo himself
  // Actually we do not need this, we should use the exposed API below for model relation instead.
  // Using: POST /customers/{id}/orders
  Customer.createAddress = (ctx, body) => {
    const data = {};
    data.street = ctx.req.body.street;
    data.city = ctx.req.body.city;
    data.state = ctx.req.body.state;
    data.country = ctx.req.body.country;
    data.zipCode = ctx.req.body.zipCode;
    data.isDefault = ctx.req.body.isDefault;
    currentCustomerId = ctx.req.accessToken.userId;
    // log(ctx.req.body);
    Customer.findById(currentCustomerId, (err, customerInstance) => {
      customerInstance.customerAddresses.create(data, (err, addressInstance) => {
        if (err) {
          console.error(err);
        } else {
          return addressInstance;
        }
      });
    });
  };

  Customer.credsTaken = function(body, cb) {
    if (!body.username && !body.email) {
      const err = new Error('Missing username and/or email keys');
      err.status = 400;
      console.error(err);
      return cb(err);
    }
    const result = {
      usernameTaken: false,
      emailTaken: false,
    };
    Customer.find({where: {username: body.username || ''}}, (err, models) => {
      // querying "username": undefined actually will return results (why??)
      // same seems to be true for email field
      if (err) {
        console.error(err);
        cb(err);
      } else if (models.length > 0) {
        log.warning(`Username ${body.username} taken`);
        result.usernameTaken = true;
      }
      Customer.find({where: {email: body.email || ''}}, (err, models2) => {
        if (err) {
          console.error(err);
          cb(err);
        } else if (models2.length > 0) {
          log.warning(`Email ${body.email} taken`);
          result.emailTaken = true;
          cb(null, result);
        } else {
          cb(null, result);
        }
      });
    });
  };

  Customer.remoteMethod('credsTaken', {
    description: 'CUSTOM METHOD: Check if username and/or email are taken',
    accepts: [
      {arg: 'body', type: 'object', http: {source: 'body'}},
    ],
    http: {path: '/credsTaken', verb: 'post'},
    returns: [
      {arg: 'result', type: 'object'},
    ],
  });

  Customer.prototype.getCustomerCart = function(cb) {
    const customer = this;
    customer.customerOrders({where: {orderComplete: false}}, (err, orders) => {
      if (err || orders.length > 1) {
        log.error(`Error getting customer cart or there's more than one active cart: ${err}`);
        const error = new Error('Error while querying for customer cart');
        cb(error);
      } else if (orders.length === 0) {
        log.warning(`No cart found for customer id=${customer.id}, need to create one`);
        cb(null, 0); // return id = 0 for "false"
      } else {
        log.info(`Cart already exists, is order info model with id ${orders[0].id}`);
        cb(null, orders[0].id, orders[0].checkoutIdClient, orders[0].checkoutLink);
      }
    });
  };

  Customer.prototype.uploadFile = function(ctx, options, cb) {
    const user = this;
    if (!options) options = {};
    // console.log(ctx.req);
    // console.log(ctx.req.query)
    ctx.req.params.container = CONTAINER_NAME;
    Customer.app.models.container.upload(ctx.req, ctx.result, options, (err, fileObj) => {
      if (err) {
        cb(err);
      } else {
        // console.log(fileObj);
        const uploadedFile = fileObj.files.file[0];
        // console.log(uploadedFile);
        const uploadedFields = fileObj.fields.fields[0];
        // console.log(uploadedFields);
        const FileInfoModel = app.models.fileInfo;
        FileInfoModel.create({
          uploadTime: currentTime(),
          fileName: uploadedFields.hasOwnProperty('newName') ? uploadedFields.newName : uploadedFile.originalFilename,
          containerFileName: uploadedFile.name,
          container: uploadedFile.container,
          uploader: user.username,
          customerId: user.id,
          isDeleted: false,
          isPublic: uploadedFields.isPublic === 'public',
          unit: uploadedFields.unit,
          fileSize: formatBytes(uploadedFile.size, 1),
        }, (err, obj) => {
          if (err) {
            log.error(`Error uploading ${obj.fileName}`);
            cb(err);
          } else {
            log.success(`Successfully uploaded ${obj.fileName}`);
            cb(null, obj);
          }
        });
      }
    });
  };

  Customer.prototype.downloadFile = function(ctx, cb) {
    const {fileId} = ctx.req.query;
    const user = this;
    if (fileId === undefined || fileId === '') {
      const error = new Error('Missing fileId argument');
      error.status = 400;
      cb(error);
    } else {
      Customer.app.models.fileInfo.findById(fileId, (err, file) => {
        if (err) {
          console.error(`Error getting file: ${err}`);
          cb(err);
        } else if (file === null) {
          const error = new Error('File not found');
          error.status = 404;
          cb(error);
        } else if (file.customerId !== user.id) {
          const error = new Error('Forbidden to access file');
          error.status = 403;
          cb(error);
        } else {
          ctx.res.set('Content-Disposition', `inline; filename="${file.fileName}"`); // this sets the file name
          Customer.app.models.container.download(CONTAINER_NAME, file.containerFileName, ctx.req, ctx.res, (err, fileData) => {
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

  Customer.prototype.deleteFile = function(ctx, cb) {
    const {fileId} = ctx.req.query;
    const user = this;
    // log(fileId);
    if (fileId === undefined || fileId === '') {
      const error = new Error('Missing fileId argument');
      error.status = 400;
      cb(error);
    } else {
      Customer.app.models.fileInfo.findById(fileId, (err, file) => {
        const {containerFileName} = file;
        if (err) {
          console.error(`Error getting file: ${err}`);
          cb(err);
        } else if (file === null) {
          const error = new Error('File not found');
          error.status = 404;
          cb(error);
        } else if (file.customerId !== user.id) {
          const error = new Error('Forbidden to access file');
          error.status = 403;
          cb(error);
        } else {
          // Do a soft delete
          file.updateAttributes({
            isDeleted: true,
          });
          cb(null);

          // Hard delete code that destroys the fileInfo instance and
          // also deletes from container
          // Customer.app.models.fileInfo.destroyById(fileId, function(err){
          //     if(err){
          //         console.error(`Error deleting file: ${err}`);
          //         cb(err);
          //     } else {
          //         Customer.app.models.container.removeFile(CONTAINER_NAME, containerFileName, function(err){
          //             if(err){
          //                 cb(err);
          //             } else {
          //                 cb(null);
          //             }
          //         });
          //     }
          // });
        }
      });
    }
  };

  Customer.prototype.getChipOrders = function(ctx, cb) {
    const customer = this;
    let allOrderChips = [];
    customer.customerOrders({where: {orderComplete: true}})
      .then((orders) => {
        const promises = orders.map((order, index) => order.orderChips({})
          .then((orderChips) => {
            allOrderChips = allOrderChips.concat(orderChips);
          })
          .catch((err) => {
            console.error(err);
            cb(err);
          }));
        Promise.all(promises).then(() => {
          const promises2 = allOrderChips.map((orderChip, index) => Customer.app.models.foundryWorker.findById(orderChip.workerId)
            .then((worker) => {
              if (worker === null) {
                orderChip.workerName = 'Unassigned';
              } else {
                orderChip.workerName = `${worker.firstName} ${worker.lastName}`;
              }
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

  Customer.remoteMethod('prototype.getChipOrders', {
    description: 'CUSTOM METHOD: Get all chip orders',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
    http: {path: '/orderChips', verb: 'get'},
    returns: [{arg: 'orderChips', type: 'array'}],
  });

  // Remote methods
  Customer.remoteMethod('prototype.uploadFile', {
    // see https://stackoverflow.com/questions/28885282/how-to-store-files-with-meta-data-in-loopback
    // and https://github.com/strongloop/loopback-component-storage/blob/a3c8509adf09fb6161f893c65277eb0f79762013/lib/storage-handler.js
    description: 'CUSTOM METHOD: Upload a file',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
      {arg: 'options', type: 'object', http: {source: 'query'}},
    ],
    http: {path: '/uploadFile', verb: 'post'},
    returns: {arg: 'fileInfo', type: 'object'},
    // returns: [],
  });

  Customer.remoteMethod('prototype.downloadFile', {
    description: 'CUSTOM METHOD: Download a file',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
    http: {path: '/downloadFile', verb: 'get'},
    returns: [],
  });

  Customer.remoteMethod('prototype.deleteFile', {
    description: 'CUSTOM METHOD: Delete a file',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
    http: {path: '/deleteFile', verb: 'delete'},
    returns: [],
  });

  Customer.remoteMethod('prototype.getCustomerCart', {
    description: 'CUSTOM METHOD: Get ID of orderInfo that represents customers cart; if not present, returns 0',
    accepts: [],
    http: {path: '/getCustomerCart', verb: 'get'},
    returns: [
      {arg: 'id', type: 'number'},
      {arg: 'checkoutIdClient', type: 'string'},
      {arg: 'checkoutLink', type: 'string'},
    ],
  });

  // Customer resends verification email
  // Using: POST /customers/{id}/resendEmail
  Customer.remoteMethod('resendVerifyEmail', {
    description: 'CUSTOM METHOD: resend verification email, use this instead of /verify',
    accepts: [
      {arg: 'body', type: 'object', http: {source: 'body'}},
    ],
    http: {verb: 'post'},
  });

  Customer.remoteMethod('createAddress', {
    discription: 'Customer adds another address',
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
      {arg: 'body', type: 'object', http: {source: 'body'}},

    ],
    http: {path: '/createAddress', verb: 'post'},
    returns: {arg: 'addressInstance', type: 'object', root: true},
  });

  Customer.getApiToken = function(cb) {
    cb(null, {
      token: process.env.SHOPIFY_TOKEN,
      domain: process.env.SHOPIFY_DOMAIN,
    }, 'application/json');
  };

  Customer.remoteMethod('getApiToken', {
    description: 'CUSTOM METHOD: get Api key and domain',
    http: {path: '/getApi', verb: 'get'},
    returns: [{arg: 'info', type: 'object'}],
  });
};
