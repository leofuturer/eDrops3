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
        host: "smtp.163.com",
        secure: true,
        port: 465,
        auth: {
          user: process.env.APP_EMAIL_USERNAME || "qiningwang_bit@163.com",
          pass: process.env.APP_EMAIL_PASSWORD || "edropTest123"
        }
      }
    ]
  },
};

