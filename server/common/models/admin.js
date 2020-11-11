'use strict';

//Constants
const Roles = require('../../server/constants/Roles');
const app = require("../../server/server.js");
//Remote hooks
const adminRoleMappingCreator = require('../../server/hooks/adminRoleMappingCreator');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const { ADMIN_ROLE_NAME } = Roles;
const Client = require('shopify-buy');
const fetch = require('node-fetch');
const Constants = require('../../constants');

global.fetch = fetch;

module.exports = function(Admin) {
    // create a RoleMapping entry in the database
    // so that new admin user gets the right admin permissions
    Admin.afterRemote('create', adminRoleMappingCreator(ADMIN_ROLE_NAME));

    Admin.getChipOrders = function(ctx, cb){
        var allOrderChips = [];
        Admin.app.models.orderChip.find({})
        .then(chipOrders => {
            var promises = chipOrders.map((chipOrder, index) => {
                return Admin.app.models.orderInfo.findById(chipOrder.orderId)
                .then(orderInfo => {
                    chipOrder.customerId = orderInfo.customerId;
                    allOrderChips = allOrderChips.concat(chipOrder);
                })
                .catch(err => {
                    console.error(err);
                    cb(err);
                });
            });
            Promise.all(promises).then(() => {
                var promises2 = allOrderChips.map((orderChip, index) => {
                    return Admin.app.models.customer.findById(orderChip.customerId)
                    .then(customer => {
                        orderChip.customerName = `${customer.firstName} ${customer.lastName}`;
                    })
                    .catch(err => {
                        console.error(err);
                        cb(err);
                    });
                });
                Promise.all(promises2).then(() => {
                    var promises3 = allOrderChips.map((orderChip, index) => {
                        return Admin.app.models.foundryWorker.findById(orderChip.workerId)
                        .then(worker => {
                            if(worker){
                                orderChip.workerName = `${worker.firstName} ${worker.lastName}`;
                            } else {
                                orderChip.workerName = `Not yet assigned`;
                            }

                        })
                        .catch(err => {
                            console.error(err);
                            cb(err);
                        });
                    });
                    Promise.all(promises3).then(() => {
                        cb(null, allOrderChips);
                    });
                });
            });
        })
        .catch(err => {
            cb(err);
        });
    }

    Admin.remoteMethod('getChipOrders', {
        description: 'CUSTOM METHOD: Get all chip orders',
        accepts: [
            {arg: 'ctx', type: 'object', http: { source: 'context' }},
        ],
        http: {path: '/orderChips', verb: 'get'},
        returns: [{arg: 'orderChips', type: 'array'}],
    });

  // Admin retrieve all orders
  // Using GET /orders (advanced filters can also be used)

  //Admin retrieves orders belongs to a certain worker
  //Using: GET /foundryWorkers/{id}/workerHasOrderInfos (Filters can also be used at the same time)
  //Frontend needs to pass customer id to backend

  //Admin retrieves orders belongs to a certain customer
  //Using:  GET /customers/{id}/workerHasOrderInfos (Filters can also be used at the same time)
  //Frontend needs to pass customer id to backend

  //Admin retrieve files belongs to a certain customer
  //Using: GET /customers/{id}/customerHasFiles
  //Frontend needs to pass customer id to backend

    Admin.downloadFile = function(ctx, cb){
        const fileId = ctx.req.query.fileId;
        if(fileId === undefined){
            let error = new Error(`Missing fileId argument`)
            error.status = 400;
            cb(error);
        } else {
            Admin.app.models.fileInfo.findById(fileId, function(err, file){
                if(err){
                    console.error(`Error getting file: ${err}`)
                    cb(err)
                } else if(file === null){
                    let error = new Error(`File not found`);
                    error.status = 404;
                    cb(error);
                } else {
                    ctx.res.set('Content-Disposition', `inline; filename="${file.fileName}"`); // this sets the file name
                    Admin.app.models.container.download('test_container', file.containerFileName, ctx.req, ctx.res, function(err, fileData){
                        if(err){
                            cb(err);
                        } else {
                            cb(null);
                        }
                    });
                }
            });
        }
    }

    Admin.remoteMethod('downloadFile', {
        description: 'CUSTOM METHOD: Download a file',
        accepts: [
            {arg: 'ctx', type: 'object', http: { source: 'context' }},
        ],
        http: {path: '/downloadFile', verb: 'get'},
        returns: [],
    });

    Admin.getApiToken = function(cb){
      cb(null, {
        token: process.env.SHOPIFY_TOKEN,
        domain: process.env.SHOPIFY_DOMAIN
      }, 'application/json');
    }

    Admin.remoteMethod('getApiToken', {
      description: 'CUSTOM METHOD: get Api key and domain',
      http: {path: '/getApi', verb: 'get'},
      returns: [{arg: 'info', type: 'object'}],
    });

    Admin.returnAllItems = function(cb){
      const client = Client.buildClient({
        storefrontAccessToken: process.env.SHOPIFY_TOKEN,
        domain: process.env.SHOPIFY_DOMAIN,
      });
      const productIds = [
        Constants.CONTROLSYSID,
        Constants.TESTBOARDID,
        Constants.UNIVEWODCHIPID,
      ];
      client.product.fetchMultiple(productIds)
      .then((res) => {
        cb(null, res);
      }).catch(err => console.log(err));
    }

    Admin.remoteMethod('returnAllItems', {
      description: 'Custom Method: get all products',
      http: {path: '/getItems', verb: 'get'},
      returns: [{arg: 'products', type: 'array'}],
    });
};
