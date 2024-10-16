
// import {errors, ErrorWithStatus} from '../toolbox/errors';
// import app from '../server';

// export default function checkOrderOwnership (ctx: { req: { headers: { [x: string]: any; }; params: { id: any; }; accessToken: { userId: any; }; }; }, modelInstance: any, next: (arg0?: ErrorWithStatus) => void, product = false) {
//   const OrderInfo = app.models.orderInfo;
//   const UserBase = app.models.userBase;
//   const {AccessToken} = app.models;
//   AccessToken.findById(ctx.req.headers['x-edrop-userbase'], (err, token) => {
//     if (err) next(err);
//     else {
//       UserBase.findById(token.userId, (err2, user) => {
//         if (err2) next(err2);
//         else if (product && user.userType !== 'customer' && user.userType !== 'admin') {
//           next(errors.forbidden('only customer or admin can access product'));
//         } else if (user.userType === 'customer') {
//           OrderInfo.findById(ctx.req.params.id, (err3, info) => {
//             if (err3) next(err3);
//             else if (info.customerId !== ctx.req.accessToken.userId) {
//               next(errors.forbidden('customer and order does not match'));
//             } else {
//               next();
//             }
//           });
//         } else {
//           // admin can access the product
//           next();
//         }
//       });
//     }
//   });
// };
