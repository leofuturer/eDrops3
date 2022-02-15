const {restApiRoot} = require('../config');

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  const apiRoot = server.get('restApiRoot');
  // install a `/` route that returns server status
  router.get('/', server.loopback.status());
  router.get(apiRoot, server.loopback.status());

  server.use(router);
};
