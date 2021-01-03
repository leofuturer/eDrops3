'use strict'

const errors = require('../../server/toolbox/errors');
const passwordValidation = require("../../server/hooks/passwordValidation");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const log = require('../../db/toolbox/log');

module.exports = function(Userbase){
  Userbase.beforeRemote('create', passwordValidation);
  Userbase.afterRemote('login', function(ctx, tokenInstance, next){
    Userbase.findById(tokenInstance.userId, (err, user) => {
      if(err) next(err);
      else{
        tokenInstance.username = user.username;
        tokenInstance.userType = user.userType;
        next();
      }
    })
  })
};
