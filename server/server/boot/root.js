const customerForgetPassword = require('../routes/customerForgetPassword');
const { restApiRoot } = require('../config');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  const apiRoot = server.get('restApiRoot'); 
  // install a `/` route that returns server status
  router.get('/', server.loopback.status());
  router.get(apiRoot, server.loopback.status());
  
  // install a `POST /forget-password` route
  // keep this route for resetting admin and foundry worker emails
  router.post(`${restApiRoot}/customer-forget-password`, customerForgetPassword);
  
  //install the route for redirecting when a customer registers successfully
  router.get('/verified', (req, res) => {
    res.render('verified');
  });
  server.use(router);
};
