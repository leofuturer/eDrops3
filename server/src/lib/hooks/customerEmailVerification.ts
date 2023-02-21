// import { Request, Response } from '@loopback/rest';
// import path from 'path';
// import {
//   FRONTEND_HOSTNAME,
//   FRONTEND_PORT,
// } from '../constants/emailConstants';

// export default function verifyCustomerEmail(
//   request : Request, response : Response
//   customerInstance: {
//     username: any;
//     verify: (
//       arg0: {
//         type: string;
//         to: any;
//         from: string | undefined;
//         subject: string;
//         text: string;
//         template: any;
//         protocol: string;
//         host: any;
//         port: any;
//         redirect: string;
//       },
//       arg1: (err: any, res: any) => any,
//     ) => void;
//     id: any;
//   },
//   next: (arg0: any) => any,
// ) {
//   const {customer} = ctx.req.app.models;
//   const {email} = ctx.req.body;

//   // uncomment line below to bypass email verification
//   // customerInstance.updateAttribute('emailVerified', 1);

//   // console.log(ctx.req);
//   const options = {
//     type: 'email',
//     to: email,
//     from: process.env.APP_EMAIL_USERNAME,
//     subject: '[eDroplets] Email Verification',
//     text: `Hello ${customerInstance.username}! Thanks for registering to use eDroplets. Please verify your email by clicking on the following link:`,
//     template: path.resolve(__dirname, '../views/verify.ejs'),
//     protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
//     host: FRONTEND_HOSTNAME,
//     port: FRONTEND_PORT,
//     redirect: '/emailVerified',
//   };

//   customerInstance.verify(options, (err, res) => {
//     if (err) {
//       // email sending failed, so don't create customer
//       customer.deleteById(customerInstance.id);
//       return next(err);
//     }

//     response.send({
//       message: 'Signup successful!',
//       id: customerInstance.id,
//     });
//     // can change this in the future with some other send method:
//     // https://expressjs.com/en/api.html#res.send
//   });
// }
