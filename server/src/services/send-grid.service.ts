import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { SendGridDataSource } from '../datasources';

export default interface SendGrid {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.

  send (apiKey : string, body: object) : Promise<object>;
}

export class SendGridProvider implements Provider<SendGrid> {
  constructor(
    // SendGrid must match the name property in the datasource json file
    @inject('datasources.SendGrid')
    protected dataSource: SendGridDataSource = new SendGridDataSource(),
  ) {}

  value(): Promise<SendGrid> {
    return getService(this.dataSource);
  }
}
