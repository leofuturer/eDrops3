'use strict';

//Constants
const Roles = require('../../server/constants/Roles');

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
};
