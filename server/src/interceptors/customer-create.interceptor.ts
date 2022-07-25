import {
  inject,
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Request, RestBindings } from '@loopback/rest';
import validatePassword from '../lib/hooks/passwordValidation';
// import verifyCustomerEmail from '../lib/hooks/customerEmailVerification';
import log from '../lib/toolbox/log';
import { Customer } from '../models';
import { CustomerRepository } from '../repositories';

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
      return result;
    } catch (err) {
      // Add error handling logic here
      console.log(err);
      throw err;
    }
  }
}
