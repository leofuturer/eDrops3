import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
import { createShopifyWebhook, deleteShopifyWebhook } from '../lib/ngrok';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class NgrokObserver implements LifeCycleObserver {
  /*
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}
  */

  private webhookId: number;

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
    // Create webhook
    if (process.env.NODE_ENV === 'development') {
      const webhook = await createShopifyWebhook();
      console.log('Created webhook: ', webhook)
      this.webhookId = webhook.id;
    }
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
    // Delete webhook
    if (process.env.NODE_ENV === 'development'){
      console.log('Deleting webhook: ', this.webhookId)
      deleteShopifyWebhook(this.webhookId);
    }
  }
}
