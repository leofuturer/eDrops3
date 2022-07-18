import chalk from 'chalk';

export default {
  success: (message: string) => {
    console.log(`${chalk.green('success')} ${message}`);
  },

  error: (message: string) => {
    console.log(`${chalk.red('error')} ${message}`);
  },

  warning: (message: string) => {
    console.log(`${chalk.yellow('warning')} ${message}`);
  },

  info: (message: string) => {
    console.log(`${chalk.blue('info')} ${message}`);
  },
};
