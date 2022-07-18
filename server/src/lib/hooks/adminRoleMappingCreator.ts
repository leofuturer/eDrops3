// import Roles from '../constants/roles';

// export default function adminRoleMapping(roleName: any, ctx: { req: { app: { models: { Role: any; RoleMapping: any; }; }; }; }, userInstance: { id: any; }, next: (arg0?: undefined) => any) {
//   const {Role, RoleMapping} = ctx.req.app.models;

//   Role.findOne({where: {name: roleName}}, (err, role) => {
//     if (err) {
//       console.error(err);
//       return next(err);
//     }
//     if (role === null || role === undefined) {
//       Role.create({
//         name: 'admin',
//       }, (err, role) => {
//         if (err) {
//           console.error(err);
//           return next(err);
//         }
//         role.principals.create({
//           principalType: RoleMapping.USER,
//           principalId: userInstance.id,
//         }, (err, principal) => {
//           if (err) {
//             console.error(err);
//             return next(err);
//           }
//           return next();
//         });
//       });
//     } else {
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: userInstance.id,
//       }, (err, principal) => {
//         if (err) {
//           console.error(err);
//           return next(err);
//         }
//         return next();
//       });
//     }
//   });
// };
