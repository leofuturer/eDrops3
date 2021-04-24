
const loopback = require('loopback');
const boot = require('loopback-boot');
const path = require('path');
const bodyParser = require('body-parser');

const app = module.exports = loopback();

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// configure body parsernod
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.token());

app.start = function() {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (process.env.NODE_ENV === 'dev') {
      if (app.get('loopback-component-explorer')) {
        const explorerPath = app.get('loopback-component-explorer').mountPath;
        console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      }
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('WARNING: NODE_ENV environment variable is not set. Things may not work properly.');
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});

app.get('remoting').errorHandler = {
  handler(err, req, res, defaultHandler) {
    // err = app.buildError(err); //if we want custom error msgs/codes
    if (err.code === 'INVALID_TOKEN') {
      console.log(err);
      res.redirect('/emailVerifyInvalid');
    } else {
      defaultHandler(err);
    }
  },
};

// app.buildError = function(err) {
//   err.message = '123 Custom message: ' + err.message;
//   err.status = 408; // override the status

//   // remove the statusCode property
//   delete err.statusCode;
// console.log(err);
//   return err;
// };
