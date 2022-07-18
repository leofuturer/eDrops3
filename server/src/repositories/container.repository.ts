import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Container, ContainerRelations } from '../models';

export class ContainerRepository extends DefaultCrudRepository<
  Container,
  typeof Container.prototype.id,
  ContainerRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Container, dataSource);
  }
}
