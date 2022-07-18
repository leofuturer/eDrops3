const Roles = require('../constants/Roles');

module.exports = (roleName) => (ctx, userInstance, next) => {
  const {Role, RoleMapping} = ctx.req.app.models;

  Role.findOne({where: {name: roleName}}, (err, role) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (role === null || role === undefined) {
      Role.create({
        name: 'admin',
      }, (err, role) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: userInstance.id,
        }, (err, principal) => {
          if (err) {
            console.error(err);
            return next(err);
          }
          return next();
        });
      });
    } else {
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: userInstance.id,
      }, (err, principal) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        return next();
      });
    }
  });
};
