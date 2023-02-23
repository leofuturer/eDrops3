import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderMessage extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
  })
  id?: number;
 
  @property({
    type: 'number',
    required: true,
  })
  orderId: number;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'number',
    required: true,
  })
  userConvId: number;

  @property({
    type: 'date',
    required: true,
  })
  messageDate: Date;
  
  constructor(data?: Partial<OrderMessage>) {
    super(data);
  }
}

export interface OrderMessageRelations {
  // describe navigational properties here
}

export type OrderMessageWithRelations = OrderMessage & OrderMessageRelations;
