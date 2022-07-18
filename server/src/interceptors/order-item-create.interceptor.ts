import {
  Getter,
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
import { HttpErrors, Request, RestBindings } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { OrderInfo } from '../models';
import { OrderInfoRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: OrderItemCreateInterceptor.BINDING_KEY}})
export class OrderItemCreateInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${OrderItemCreateInterceptor.name}`;

  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject.getter(SecurityBindings.USER, {optional: true})
    private getCurrentUser: Getter<UserProfile>,
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
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
      this.getCurrentUser()
        .then((user: UserProfile) => {
          if (user.userType !== 'customer') {
            throw new HttpErrors.Unauthorized(
              'Only customer can add chip to cart',
            );
          }
          return user;
        })
        .then((user: UserProfile) => {
          this.orderInfoRepository
            .findById(this.request.body.orderInfoId)
            .then((orderInfo : OrderInfo) => {
              if (orderInfo.customerId !== user.id) {
                throw new HttpErrors.Unauthorized(
                  'Customer does not have access to resource',
                );
              }
            });
        }).catch(err => {
          throw new HttpErrors.InternalServerError(err);
        });
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
