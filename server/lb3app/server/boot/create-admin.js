// Bootstrap script to create default admin user with all permissions
// Adapted from https://github.com/strongloop/loopback-example-access-control/blob/master/server/boot/sample-models.js

const ADMIN_ROLE_NAME = 'admin';
const SERVER_START_FILE_NAME = 'server.js';

module.exports = function(app) {
  const Admin = app.models.admin;
  const User = app.models.userBase;
  const {Role} = app.models;
  const {RoleMapping} = app.models;

  console.log(process.argv);

  if (process.argv[1].slice(-1 * SERVER_START_FILE_NAME.length) === SERVER_START_FILE_NAME) {
  // only run this script if we run `node .` or `node server/server.js`
    console.log('Checking if we need to create default admin user');
    // If adminA already exists, such as when running reset-db.js, skip
    Admin.findOne({where: {username: 'adminA'}}, (err, adminAccount) => {
      if (err) {
        throw err;
      } else if (adminAccount === null || adminAccount === undefined) {
        console.log('Creating default admin user!');
        Admin.create([
          {
            username: 'adminA',
            email: 'edropswebsite@gmail.com',
            password: 'edropTest123',
            phoneNumber: '1-310-111-2222',
          },
        ], (err, users) => {
          if (err) {
            throw err;
          } else {
            console.log('Created users:', users);
            User.findOne({where: {username: 'adminA'}}, (err, user) => {
              if (err) throw err;
              else if (user === null || user === undefined) {
                User.create([
                  {
                    username: 'adminA',
                    email: 'edropswebsite@gmail.com',
                    password: 'edropTest123',
                    userType: 'admin',
                    userId: 1,
                  },
                ], (err, res) => {
                  if (err) throw err;
                  else {
                    console.log('Linked to user model.');
                  }
                });
              }
            });
            Role.findOne({where: {name: ADMIN_ROLE_NAME}}, (err, role) => {
              if (err) {
                throw err;
              } else if (role === null || role === undefined) {
                Role.create({
                  name: ADMIN_ROLE_NAME,
                }, (err, role) => {
                  if (err) {
                    throw err;
                  } else {
                  // make adminA part of the `admin` group
                    role.principals.create({
                      principalType: RoleMapping.USER,
                      principalId: users[0].id,
                    }, (err, principal) => {
                      if (err) {
                        throw err;
                      } else {
                        console.log('Created principal:', principal);
                      }
                    });
                  }
                  console.log('Created role:', role);
                });
              } else {
              // Role already exists, so just create principal
                role.principals.create({
                  principalType: RoleMapping.USER,
                  principalId: users[0].id,
                }, (err, principal) => {
                  if (err) {
                    console.error(err);
                    return next(err);
                  }
                  console.log('Created principal:', principal);
                });
              }
            });
          }
        });
      }
    });
  }
};