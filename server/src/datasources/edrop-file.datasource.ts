import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, '.env')});

let config = {};
if (process.env.NODE_ENV === 'dev')
  config = {
    name: 'edropFile',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: './storage',
    maxFileSize: (30 * 1000 * 1000).toString(), // 30 MB
    nameConflict: 'makeUnique',
  };
else if (process.env.NODE_ENV === 'production')
   config = {
    name: 'edropFile',
    connector: 'loopback-component-storage',
    provider: 'amazon',
    keyId: process.env.S3_AWS_ACCESS_KEY_ID,
    key: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_AWS_DEFAULT_REGION,
    nameConflict: 'makeUnique',
  };

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class EdropFileDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'edropFile';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.edropFile', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
