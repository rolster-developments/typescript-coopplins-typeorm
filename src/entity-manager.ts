import { EntityManager, XofttionEntityManager } from '@rolster/typescript-hexagonal';
import { QueryRunner } from 'typeorm';
import { TypeormEntityDataSource } from './datasource';

export abstract class TypeormEntityManager extends EntityManager {
  abstract setRunner(runner: QueryRunner): void;
}

export class XofttionTypeormEntityManager
  extends XofttionEntityManager
  implements TypeormEntityManager
{
  constructor(private typeormDataSource: TypeormEntityDataSource) {
    super(typeormDataSource);
  }

  public setRunner(runner: QueryRunner): void {
    this.typeormDataSource.setRunner(runner);
  }
}
