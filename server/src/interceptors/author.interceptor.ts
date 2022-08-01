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
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {UserRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: AuthorInterceptor.BINDING_KEY}})
export class AuthorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${AuthorInterceptor.name}`;

  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @repository(UserRepository) public userRepository: UserRepository,
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
      // Check for userId in url params
      const userIdRegex = /\/users\/([a-zA-Z0-9-]+?)\//;
      const userIdMatch = this.request.url.match(userIdRegex) ?? '';
      let userId;
      if (userIdMatch.length > 1) {
        userId = userIdMatch[1];
      } else {
        userId = this.request.body.userId;
      }
      if (!userId) {
        throw new HttpErrors.BadRequest('Cannot identify user');
      }
      const username = await this.userRepository
        .findById(userId)
        .then(user => user.username)
        .catch(err => {
          throw new HttpErrors.InternalServerError(err);
        });
      this.request.body.author = username;
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
