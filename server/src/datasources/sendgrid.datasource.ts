import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, '.env')});

const config = {
  name: 'sendgrid',
  connector: 'loopback-connector-sendgrid',
  api_key: process.env.APP_EMAIL_API_KEY
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SendgridDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'sendgrid';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sendgrid', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
