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
import { repository } from '@loopback/repository'
import { Request, RestBindings } from '@loopback/rest'
import log from '../lib/toolbox/log'
import { OrderChip, OrderInfo, FoundryWorker, FileInfo, Customer } from '../models'
import { OrderChipRepository, OrderInfoRepository, FoundryWorkerRepository, FileInfoRepository, CustomerRepository } from '../repositories';
import SendGrid from '../services/send-grid.service'
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER,
} from '../lib/constants/emailConstants';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: OrderChipUpdateInterceptor.BINDING_KEY}})
export class OrderChipUpdateInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${OrderChipUpdateInterceptor.name}`;

  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @repository(OrderChipRepository)
    protected orderChipRepository: OrderChipRepository,
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
    @repository(FoundryWorkerRepository)
    protected foundryWorkerRepository: FoundryWorkerRepository,
    @repository(FileInfoRepository)
    protected fileInfoRepository: FileInfoRepository,
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
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
      const key = Object.keys(this.request.body)[0];
      const id = parseInt(this.request.url.split('/').slice(-1)[0]);

      if(key !== 'workerId' && key !== 'status') {
        return await next();
      }
      
      const chipOrder = await this.orderChipRepository.findById(id);
      if(chipOrder[key] === this.request.body[key])
        throw new Error('Do not update OrderChip, value unchanged');
      if(chipOrder[key] === 'status' && chipOrder.workerId === null)
        throw new Error('Cannot update status if no foundry worker assigned');

      const fileInfo = await this.fileInfoRepository.findById(chipOrder.fileInfoId);
      const orderInfo = await this.orderInfoRepository.findById(chipOrder.orderInfoId);
      const customer = await this.customerRepository.findById(orderInfo.customerId);

      const orderDetails = {
        file: fileInfo.fileName,
        process: chipOrder.process,
        coverPlate: chipOrder.coverPlate ? "Yes" : "No",
        quantity: chipOrder.quantity,
      }

      let result;
      
      if(key === 'workerId') {
        result = await next();

        // Add post-invocation logic here
        const foundryWorker = await this.foundryWorkerRepository.findById(this.request.body[key]);
        // assigned foundry
        // console.log(`Hi ${foundryWorker.firstName}::${foundryWorker.email}, you have been assigned to ${fileInfo.fileName}, ${chipOrder.quantity}, ${chipOrder.process}, ${chipOrder.coverPlate ? 'Yes' : 'No'}`);
        const sendGridOptionsFoundry = {
          "from":{
            "email": EMAIL_SENDER, 
          },
          "personalizations":[{
            "to":[{
              "email": foundryWorker.email,
            }],
            "dynamic_template_data":{
              "firstName": foundryWorker.firstName,
              "orderDetails": orderDetails,
            }
          }],
          "template_id": "d-6ad747406ac64d359a35495e253be12d",
        };
        this.sendGrid.send(
          process.env.APP_EMAIL_API_KEY as string,
          sendGridOptionsFoundry,
        );

        // customer
        // console.log(`Hi ${customer.firstName}::${orderInfo.user_email}, your order has been assigned to FW from ${foundryWorker.affiliation}, ${chipOrder.quantity}, ${chipOrder.process}, ${chipOrder.coverPlate ? 'Yes' : 'No'}`);
        const sendGridOptionsCustomer = {
          "from":{
            "email": EMAIL_SENDER, 
          },
          "personalizations":[{
            "to":[{
              "email": orderInfo.user_email,
            }],
            "dynamic_template_data":{
              "firstName": customer.firstName,
              "affiliation": foundryWorker.affiliation,
              "orderDetails": orderDetails,
            }
          }],
          "template_id": "d-373704b51560476bb3d19c96d30feeaa",
        };
        this.sendGrid.send(
          process.env.APP_EMAIL_API_KEY as string,
          sendGridOptionsCustomer,
        );

        if(chipOrder.workerId !== null) {
          const oldFoundryWorker = await this.foundryWorkerRepository.findById(chipOrder.workerId);
          // console.log(`${oldFoundryWorker.firstName} you have been unassigned`);
          
          const sendGridOptionsOldFoundry = {
            "from":{
              "email": EMAIL_SENDER, 
            },
            "personalizations":[{
              "to":[{
                "email": oldFoundryWorker.email,
              }],
              "dynamic_template_data":{
                "firstName": oldFoundryWorker.firstName,
                "orderDetails": orderDetails,
              }
            }],
            "template_id": "d-caf2d6985cdc41c882e8940884b072d1",
          };
          this.sendGrid.send(
            process.env.APP_EMAIL_API_KEY as string,
            sendGridOptionsOldFoundry,
          );
        }
      } else if(key === 'status') {
        result = await next();
        // Add post-invocation logic here

        const foundryWorker = await this.foundryWorkerRepository.findById(chipOrder.workerId);
        // console.log(`Hi ${customer.firstName}::${orderInfo.user_email}, your order status has been updated to ${this.request.body[key]} by FW from ${foundryWorker.affiliation}, ${chipOrder.quantity}, ${chipOrder.process}, ${chipOrder.coverPlate ? 'Yes' : 'No'}`);

        const sendGridOptionsStatus = {
          "from":{
            "email": EMAIL_SENDER, 
          },
          "personalizations":[{
            "to":[{
              "email": orderInfo.user_email,
            }],
            "dynamic_template_data":{
              "firstName": customer.firstName,
              "affiliation": foundryWorker.affiliation,
              "orderDetails": orderDetails,
            }
          }],
          "template_id": (this.request.body[key] === 'Fabrication request received')? 'd-4214ff5db42d4c2aa454480729f065f4': 
            (this.request.body[key] === 'Project Started')? 'd-fcd1558c0858457dbc71d74fe51faf88': 
            (this.request.body[key] === 'Project Completed' )? 'd-478d5e6a854e4bbd8dc7454a1acd52ca': 
            'd-0c0085cba1a34286be944acbb0f3547d', /* Item Shipped */
        };

        this.sendGrid.send(
          process.env.APP_EMAIL_API_KEY as string,
          sendGridOptionsStatus,
        )
      }
      
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
