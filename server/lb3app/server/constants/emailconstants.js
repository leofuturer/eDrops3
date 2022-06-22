
module.exports = {
  // for the TO field, but it's redundant with datasources.local.js; need to eliminate
  FRONTEND_HOSTNAME: process.env.APP_FRONTEND_HOSTNAME || 'localhost',
  FRONTEND_PORT: process.env.APP_FRONTEND_PORT || 8086,
};
