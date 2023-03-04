import { belongsTo, Entity, hasMany, model, property } from '@loopback/repository';
import { CustomerAddress } from './customer-address.model';
import { FileInfo } from './file-info.model';
import { OrderInfo } from './order-info.model';
import { User } from './user.model';

@model({
  settings: {
    description: 'Additional customer information',
    forceId: false,
  },
})
export class Customer extends Entity {
  @property({
    type: 'string',
    id: 1,
    defaultFn: 'uuidv4',
    limit: 36,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    required: true,
    default: 'person',
  })
  customerType: 'person' | 'company';

  @hasMany(() => CustomerAddress)
  customerAddresses?: CustomerAddress[];

  @hasMany(() => FileInfo)
  fileInfos?: FileInfo[];

  @hasMany(() => OrderInfo)
  orderInfos?: OrderInfo[];

  @belongsTo(() => User)
  userId?: string;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
