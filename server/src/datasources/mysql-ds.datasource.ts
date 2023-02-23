import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '.env')});

const config = {
  name: 'mysqlDS',
  connector: 'mysql',
  debug: false,
  database: process.env.APP_MYSQL_DATABASE ?? 'edrop_db',
  host: process.env.APP_MYSQL_HOST ?? 'localhost',
  port: parseInt(process.env.APP_MYSQL_PORT as string, 10) ?? 3306,
  username: process.env.APP_MYSQL_USERNAME,
  password: process.env.APP_MYSQL_PASSWORD,
  connectTimeout: 20000,
  acquireTimeout: 20000,
  allowExtendedOperators: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mysqlDS';

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysqlDS', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
