/**
 * We don't use separate config files for each environment,
 * rather we use env vars to override values.
 */

'use strict';
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});

module.exports = {
  mysqlDS: {
    name: 'mysqlDS',
    connector: 'mysql',
    debug: false,
    database: process.env.APP_MYSQL_DATABASE || 'edrop_user_management',
    host: process.env.APP_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.APP_MYSQL_PORT) || 3306,
    username: process.env.APP_MYSQL_USERNAME,
    password: process.env.APP_MYSQL_PASSWORD,
  },
  edropFile: {
    name: "edropFile",
    connector: "loopback-component-storage",
    provider: "filesystem",
    root: "./storage",
    maxFileSize: "10485760",
    nameConflict: "makeUnique",
  },
  myEmailDataSource: {
    name: "myEmailDataSource",
    connector: "mail",
    transports: [
      {
        type: "SMTP",
        host: process.env.APP_EMAIL_HOST || "smtp.gmail.com",
        secure: true,
        port: parseInt(process.env.APP_EMAIL_PORT) || 465,
        auth: {
          user: process.env.APP_EMAIL_USERNAME,
          pass: process.env.APP_EMAIL_PASSWORD
        }
      }
    ]
  },
};
