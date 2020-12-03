'use strict';

const Roles = require('../constants/Roles');
const { ADMIN_ROLE_NAME } = Roles;

module.exports = roleName => (ctx, userInstance, next) => {
  const { Role, RoleMapping } = ctx.req.app.models;

  Role.findOne({ where: { name: roleName } }, (err, role) => {
    if (err){
      console.error(err);
      return next(err);
    } 
    else if(role === null || role === undefined){
      Role.create({
        name: "admin"
      }, function(err, role){
        if(err){
          console.error(err);
          return next(err);
        }
        else{
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: userInstance.id,
          }, function(err, principal){
            if(err){
              console.error(err);
              return next(err);
            }
            else{
              return next();
            }
          });
        }
      })
    } else {
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: userInstance.id,
      }, function(err, principal){
        if(err){
          console.error(err);
          return next(err);
        }
        else{
          return next();
        }
      });
    };
  });
};
