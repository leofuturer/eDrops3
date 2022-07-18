import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'SendGrid',
  connector: 'rest',
  debug: true,
  crud: false,
  operations: [
    {
      template: {
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer {apiKey}',
        },
        body: '{data}',
      },
      functions: {
        send: [
          'apiKey',
          'data',
        ],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SendGridDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'SendGrid';
  
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.SendGrid', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
