import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false, validateUpsert: true, idInjection: true}})
export class Container extends Model {
  @property({
    type: 'number',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Container>) {
    super(data);
  }
}

export interface ContainerRelations {
  // describe navigational properties here
}

export type ContainerWithRelations = Container & ContainerRelations;
