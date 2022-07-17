/**
 * We don't use separate config files for each environment,
 * rather we use env vars to override values.
 */

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});

if (process.env.NODE_ENV === 'dev') {
  var storage = {
    name: 'edropFile',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: './storage',
    maxFileSize: (30 * 1000 * 1000).toString(), // 30 MB
    nameConflict: 'makeUnique',
  };
} else if (process.env.NODE_ENV === 'production') {
  var storage = {
    name: 'edropFile',
    connector: 'loopback-component-storage',
    provider: 'amazon',
    keyId: process.env.S3_AWS_ACCESS_KEY_ID,
    key: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_AWS_DEFAULT_REGION,
    nameConflict: 'makeUnique',
  };
}

module.exports = {
  mysqlDS: {
    name: 'mysqlDS',
    connector: 'mysql',
    debug: false,
    database: process.env.APP_MYSQL_DATABASE || 'edrop_db',
    host: process.env.APP_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.APP_MYSQL_PORT) || 3306,
    username: process.env.APP_MYSQL_USERNAME,
    password: process.env.APP_MYSQL_PASSWORD,
    connectTimeout: 20000,
    acquireTimeout: 20000
  },
  edropFile: storage,
  sendgrid: {
    connector: 'loopback-connector-sendgrid',
    api_key: process.env.APP_EMAIL_API_KEY,
  }
};
