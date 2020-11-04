'use strict';

const Roles = require('../constants/Roles');
const { ADMIN_ROLE_NAME } = Roles;

module.exports = roleName => (ctx, userInstance, next) => {
  const { Role, RoleMapping } = ctx.req.app.models;

  Role.findOne({ where: { name: roleName } }, (err, role) => {
    if (err) return next(err);

    //role.principals.create() is an instance method
    //create roleMapping
    if(role === null || role === undefined) return;
    role.principals.create({
      principalType: ADMIN_ROLE_NAME,
      principalId: userInstance.id,
    }, (err) => {
      if (err) return next(err);
      return next();
    });
  });
};
