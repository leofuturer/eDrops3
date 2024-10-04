import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
require('dotenv').config()

const config = {
  name: 'mysqlDS',
  connector: 'mysql',
  debug: false,
  database: process.env.APP_MYSQL_DATABASE,
  host: process.env.APP_MYSQL_HOST,
  port: 3306,
  user: process.env.APP_MYSQL_USERNAME,
  password: process.env.APP_MYSQL_PASSWORD,
  allowExtendedOperators: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mysqlDS';

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysqlDS', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
