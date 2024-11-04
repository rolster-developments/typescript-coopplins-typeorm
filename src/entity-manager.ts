import { AbstractEntityManager, EntityManager } from '@rolster/vinegar';
import { QueryRunner } from 'typeorm';
import { EntityDataSource } from './datasource';

export abstract class AbstractTypeormEntityManager extends AbstractEntityManager {
  abstract setQueryRunner(queryRunner: QueryRunner): void;
}

export class TypeormEntityManager
  extends EntityManager
  implements AbstractTypeormEntityManager
{
  constructor(private dataSource: EntityDataSource) {
    super(dataSource);
  }

  public setQueryRunner(queryRunner: QueryRunner): void {
    this.dataSource.setQueryRunner(queryRunner);
  }
}
