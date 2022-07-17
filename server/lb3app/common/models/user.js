
const errors = require('../../server/toolbox/errors');
const passwordValidation = require('../../server/hooks/passwordValidation');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
const log = require('../../db/toolbox/log');
const {FRONTEND_HOSTNAME, FRONTEND_PORT} = require('../../server/constants/emailconstants');
const {User} = require('loopback');

module.exports = function(Userbase) {
  Userbase.beforeRemote('create', passwordValidation);

  Userbase.afterRemote('login', (ctx, tokenInstance, next) => {
    Userbase.findById(tokenInstance.userId, (err, user) => {
      if (err) next(err);
      else {
        tokenInstance.username = user.username;
        tokenInstance.userType = user.userType;
        next();
      }
    });
  });

  Userbase.beforeRemote('setPassword', (ctx, userInstance, next) => {
    // this is called before password is reset with /customers/reset-password
    if (!passwordRegex.test(ctx.req.body.newPassword)) {
      next(errors.validationError('Password does not meet security requirements'));
    } else {
      Userbase.findById(ctx.args.id, (err, instance) => {
        if (err) {
          console.log(err);
        } else {
          let Base;
          if (instance.userType === 'customer') {
            Base = Userbase.app.models.customer;
          } else if (instance.userType === 'admin') {
            Base = Userbase.app.models.admin;
          } else {
            Base = Userbase.app.models.foundryWorker;
          }
          Base.findOne({where: {email: instance.email}}, (err, modelInstance) => {
            if (err) console.log(err);
            else {
              // update the password of the actual customer/worker/admin instance too
              modelInstance.updateAttribute('password', User.hashPassword(ctx.req.body.newPassword), (err, newInstance) => {
                if (err) {
                  console.log(err);
                } else {
                  next();
                }
              });
            }
          });
        }
      });
    }
  });

  Userbase.on('resetPasswordRequest', (info) => {
    // from https://loopback.io/doc/en/lb3/Logging-in-users.html
    const url = (process.env.NODE_ENV === 'production') ?
      `http://${FRONTEND_HOSTNAME}/resetPassword` :
      `http://${FRONTEND_HOSTNAME}:${FRONTEND_PORT}/resetPassword`;

    const text = 'Hello user,\n\n' +
    `You've requested a password reset. Please visit ${url}?access_token=` +
    `${info.accessToken.id} to reset your password. ` +
    'This link will expire in 15 minutes.\n\n' +
    'Sincerely,\n' +
    'eDrops Website\n\n' +
    `Need help? Contact us at ${process.env.APP_EMAIL_USERNAME}\n`;
    const html = 'Hello user,<br><br>' +
                    `You've requested a password reset. Please click <a href="${url}?access_token=` +
                    `${info.accessToken.id}">here</a> to reset your password. ` +
                    'This link will expire in 15 minutes.<br><br>' +
                    'Sincerely,<br>' +
                    'eDrops Website<br><br>' +
                    `Need help? Contact us at ${process.env.APP_EMAIL_USERNAME}<br>`;
    log.info(`> Sending password reset email to: ${info.email}`);

    const msg = {
      to: info.email,
      from: process.env.APP_EMAIL_USERNAME,
      subject: '[eDrops] Password Reset Request',
      text,
      html,
    };
    Userbase.app.models.Email.send(msg, (err) => {
      if (err) {
        console.error(err);
        return console.error('> Error sending password reset email');
      }
      log.success('> Successfully sent password reset email');
    });
  });
};
