import chalk from 'chalk';

export default {
  success: (message: string) => {
    console.log(`${chalk.bgGreen('success')} ${message}`);
  },

  error: (message: string) => {
    console.log(`${chalk.bgRed('error')} ${message}`);
  },

  warning: (message: string) => {
    console.log(`${chalk.bgYellow('warning')} ${message}`);
  },

  info: (message: string) => {
    console.log(`${chalk.bgBlue('info')} ${message}`);
  },
};
