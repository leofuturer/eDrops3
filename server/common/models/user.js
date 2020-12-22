'use strict'
module.exports = function(User){
  User.afterRemote('login', function(ctx, tokenInstance, next){
    User.findById(tokenInstance.userId, (err, user) => {
      if(err) next(err);
      else{
        tokenInstance.username = user.username;
        next();
      }
    })
  })
};
