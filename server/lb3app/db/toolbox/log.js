
/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');

module.exports = {
  success: (message) => {
    console.log(`${chalk.green('success')} ${message}`);
  },

  error: (message) => {
    console.log(`${chalk.red('error')} ${message}`);
  },

  warning: (message) => {
    console.log(`${chalk.yellow('warning')} ${message}`);
  },

  info: (message) => {
    console.log(`${chalk.blue('info')} ${message}`);
  },
};
