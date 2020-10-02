'use strict';

//Constants
const Roles = require('../../server/constants/Roles');
const app = require("../../server/server.js");
//Remote hooks
const adminRoleMappingCreator = require('../../server/hooks/adminRoleMappingCreator');

const { ADMIN_ROLE_NAME } = Roles;

module.exports = function(Admin) {
  // create a RoleMapping entry in the database
  // so that new admin user gets the right admin permissions
  Admin.afterRemote('create', adminRoleMappingCreator(ADMIN_ROLE_NAME));

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
};
