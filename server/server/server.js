'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var bodyParser = require('body-parser');

var app = module.exports = loopback();

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// configure body parsernod
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.token());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.get('remoting').errorHandler = {
  handler: function(err, req, res, defaultHandler) {
    // err = app.buildError(err); //if we want custom error msgs/codes
    if(err.code === "INVALID_TOKEN"){
      console.log(err);
      res.redirect('/emailVerifyInvalid');
    }
    else{
      defaultHandler(err);
    }
  }
};

// app.buildError = function(err) {
//   err.message = '123 Custom message: ' + err.message;
//   err.status = 408; // override the status

//   // remove the statusCode property
//   delete err.statusCode;
// console.log(err);
//   return err;
// };
