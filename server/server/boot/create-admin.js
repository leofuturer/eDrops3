// Bootstrap script to create default admin user with all permissions
// Adapted from https://github.com/strongloop/loopback-example-access-control/blob/master/server/boot/sample-models.js

const ADMIN_ROLE_NAME = "admin"
const SERVER_START_FILE_NAME = "server"

module.exports = function(app) {
  var Admin = app.models.admin;
  var User = app.models.userBase;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

if(process.argv[1].slice(-1*SERVER_START_FILE_NAME.length) === SERVER_START_FILE_NAME){
  // only run this script if we run `node .` or `node server/server.js`
  console.log("Creating default admin user!");
  // If adminA already exists, such as when running reset-db.js, skip
  Admin.findOne({where: {username: "adminA"}}, (err, adminAccount) => {
    if(err){
      throw err;
    } else if(adminAccount === null || adminAccount === undefined){
      Admin.create([
        {
          username: 'adminA',
          email: 'edropwebsite@gmail.com',
          password: 'edropTest123',
          phoneNumber: "1-310-111-2222",
        },
      ], function(err, users) {
        if (err){
          throw err;
        } else {
          console.log('Created users:', users);
          User.findOne({where: {username: "adminA"}}, (err, user) => {
            if(err) throw err;
            else if(user === null || user === undefined){
              User.create([
                {
                  username: 'adminA',
                  email: 'edropwebsite@gmail.com',
                  password: 'edropTest123',
                  userType: 'admin',
                  userId: 1,
                },
              ], (err, res)=>{
                if(err) throw err;
                else{
                  console.log('Linked to user model.');
                }
              })
            }
          })
          Role.findOne({where: {name: ADMIN_ROLE_NAME}}, (err, role) => {
            if (err){
              throw err;
            } else if(role === null || role === undefined){
              Role.create({
                name: ADMIN_ROLE_NAME
              }, function(err, role) {
                if (err){
                  throw err;
                } else {
                  //make adminA part of the `admin` group
                  role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: users[0].id
                    }, function(err, principal) {
                      if (err){
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
                }, function(err, principal){
                if(err){
                  console.error(err);
                  return next(err);
                } else{
                  console.log('Created principal:', principal);
                }
              });
            }
          });
        }
      });
    }
  });
}
};
