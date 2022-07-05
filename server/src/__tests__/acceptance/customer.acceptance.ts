import {Client, expect} from '@loopback/testlab';
import {EdropsBackendApplication} from '../..';
import {setupApplication} from './test-helper';

describe('CustomerController', () => {
  let app: EdropsBackendApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /customers', async () => {
    const res = await client.get('/customers').expect(200);
    // expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
