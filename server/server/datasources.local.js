/**
 * We don't use separate config files for each environment,
 * rather we use env vars to override values.
 */

'use strict';

module.exports = {
  mysqlDS: {
    name: 'mysqlDS',
    connector: 'mysql',
    debug: false,
    database: process.env.APP_MYSQL_DATABASE || 'edrop-user-management',
    host: process.env.APP_MYSQL_HOST || 'localhost',
    port: process.env.APP_MYSQL_PORT || 3306,
    username: process.env.APP_MYSQL_USERNAME || 'root',
    password: process.env.APP_MYSQL_PASSWORD || '123456',
  },
  edropFile: {
    name: "edropFile",
    connector: "loopback-component-storage",
    provider: "filesystem",
    root: "./storage",
    maxFileSize: "10485760"
  },
  myEmailDataSource: {
    name: "myEmailDataSource",
    connector: "mail",
    transports: [
      {
        type: "SMTP",
        host: process.env.APP_EMAIL_HOST || "smtp.gmail.com",
        secure: true,
        port: process.env.APP_EMAIL_PORT || 465,
        auth: {
          user: process.env.APP_EMAIL_USERNAME || "edropwebsite@gmail.com",
          pass: process.env.APP_EMAIL_PASSWORD || "cjmemsEdrop"
        }
      }
    ]
  },
};
