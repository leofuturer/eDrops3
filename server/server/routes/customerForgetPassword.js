const {promisify} = require('bluebird');
const errors = require('../toolbox/errors');
const {ADMIN_EMAIL} = require('../constants/emailconstants');
const app = require('../server');

/**
* reset password as well as send the new password to useremail
*/
module.exports = promisify(async(req, res, next) => {
  try {
    const {email} = req.body;
    const {User} = app.models;

    const Customer = await app.models.customer.findOne({where: {email}});
    if (!Customer) return next(errors.notFound('user not found.'));

    const newPassword = req.body.newInputPassword;

    await app.models.Email.send({
      from: ADMIN_EMAIL,
      to: email,
      subject: 'Your New Password',
      text: `Your new password is:${newPassword}`,
    }, (err, mail) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent!');
      }
    });

    Customer.updateAttribute('password', User.hashPassword(newPassword), (err, instance) => {
      if (err) {
        console.log(err);
      } else {
        console.log(instance);
      }
    });

    return res.status(200).json({result: 'Password reset.'});
  } catch (err) {
    return next(err);
  }
});
