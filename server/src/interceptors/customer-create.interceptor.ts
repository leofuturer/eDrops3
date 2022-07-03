import {
  inject,
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, RestBindings} from '@loopback/rest';
import validatePassword from '../lib/hooks/passwordValidation';
// import verifyCustomerEmail from '../lib/hooks/customerEmailVerification';
import {Customer} from '../models';
import {CustomerRepository} from '../repositories';
import log from '../lib/toolbox/log';
import path from 'path';
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER,
} from '../lib/constants/emailConstants';
import SendGrid from '../services/send-grid.service';
import ejs from 'ejs';
import { verifyHTML } from '../lib/views/verify';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: CustomerCreateInterceptor.BINDING_KEY}})
export class CustomerCreateInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${CustomerCreateInterceptor.name}`;

  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @inject('services.SendGrid')
    public sendGrid: SendGrid,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      // validate security of password(at least 8 digits, include at least one uppercase
      // one lowercase, one number)
      validatePassword(this.request.body.password);
      const result: Customer = await next();
      // Add post-invocation logic here
      // create default address for user
      // copy over the address data
      // if possible, we should only pass in the customer data to the creation
      // of the customer model too
      // @ts-ignore (target will have CustomerRepository)
      const addressData: Partial<CustomerAddress>= {
        // default fields for if any are blank
        street: this.request.body.address || 'Not provided during signup',
        city: this.request.body.city || 'Not provided during signup',
        state: this.request.body.state || 'Not provided during signup',
        zipCode: this.request.body.zipCode || 'Not provided during signup',
        country: this.request.body.country || 'Not provided during signup',
        isDefault: true, // only occurs when a new customer is created
      };
      log.info('Customer instance created, now associating address with it');
      this.customerRepository
        .customerAddresses(result?.id)
        .create(addressData)
        .then(async() => {
          // create verification token
          const verificationTokenHash = await this.customerRepository.createVerificationToken(result?.id as string);

          // next: send verification email
          // uncomment line below to bypass email verification (DOESN'T WORK as of LB4 migration)
          // customerInstance.updateAttribute('emailVerified', 1);

          // console.log(ctx.req);

          // const options = {
          //   type: 'email',
          //   to: this.request.body.email,
          //   from: process.env.APP_EMAIL_USERNAME || 'service@edrops.org',
          //   subject: '[eDrops] Email Verification',
          //   text: `Hello ${this.request.body.username}! Thanks for registering to use eDrops. Please verify your email by clicking on the following link:`,
          //   template: path.resolve(__dirname, '../views/verify.ejs'),
          //   protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
          //   host: FRONTEND_HOSTNAME,
          //   port: FRONTEND_PORT,
          //   redirect: '/emailVerified',
          // };

          const baseURL = process.env.NODE_ENV == 'production' ? `https://${EMAIL_HOSTNAME}` :
            `http://${EMAIL_HOSTNAME}:${EMAIL_PORT}`;
          
          const EMAIL_TEMPLATE = ejs.render(verifyHTML, {
            text: `Hello ${this.request.body.username}! Thanks for registering to use eDrops. Please verify your email by clicking on the following link:`,
            email: EMAIL_SENDER,
            verifyHref: baseURL + `/api/customer/verify?customerId=${result?.id}&token=${verificationTokenHash}`,
          }, {});
          // console.log(EMAIL_TEMPLATE);
          const sendGridOptions = {
            personalizations: [
              {
                from: {
                  email: EMAIL_SENDER
                },
                to: [
                  {
                    email: this.request.body.email,
                    name: this.request.body.username,
                  }
                ],
                subject: '[eDrops] Email Verification',
              },
            ],
            from: {
              email: EMAIL_SENDER
            },
            reply_to: {
                email: EMAIL_SENDER
            },
            content: [{
              type: 'text/html',
              value: EMAIL_TEMPLATE,
            }],
          }

          this.sendGrid.send(process.env.APP_EMAIL_API_KEY as string, sendGridOptions);
        })
        .catch(err => {
          // roll back the customer creation
          this.customerRepository.deleteById(result?.id);
          console.error(err);
        });
      return result;
    } catch (err) {
      // Add error handling logic here
      console.log(err);
      throw err;
    }
  }
}
