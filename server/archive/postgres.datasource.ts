import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../../deploy/dev/backend.env')});

const config = {
  name: 'db',
  connector: 'postgresql',
  debug: false,
  database: process.env.APP_POSTGRES_DATABASE ?? 'edroplets',
  host: process.env.APP_POSTGRES_HOST ?? 'localhost',
  port: parseInt(process.env.APP_POSTGRES_PORT as string, 10) ?? 5432,
  username: process.env.APP_POSTGRES_USERNAME,
  password: process.env.APP_POSTGRES_PASSWORD,
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
  static dataSourceName = 'db';

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
