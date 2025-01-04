import { AbstractEntityDatabase } from '@rolster/vinegar';
import { QueryRunner } from 'typeorm';

type Resolver = (queryRunner: QueryRunner) => Promise<void>;

export abstract class EntityDatabase extends AbstractEntityDatabase {
  abstract setQueryRunner(queryRunner: QueryRunner): void;
}

export class TypeormEntityDatabase implements EntityDatabase {
  private queryRunner?: QueryRunner;

  public setQueryRunner(queryRunner: QueryRunner): void {
    this.queryRunner = queryRunner;
  }

  public connect(): Promise<void> {
    return this.resolve((queryRunner) => queryRunner.connect());
  }

  public disconnect(_?: boolean): Promise<void> {
    return this.resolve((queryRunner) => queryRunner.release());
  }

  public transaction(): Promise<void> {
    return this.resolve((queryRunner) => queryRunner.startTransaction());
  }

  public commit(): Promise<void> {
    return this.resolve((queryRunner) => queryRunner.commitTransaction());
  }

  public rollback(): Promise<void> {
    return this.resolve((queryRunner) => queryRunner.rollbackTransaction());
  }

  private async resolve(resolver: Resolver): Promise<void> {
    return this.queryRunner && resolver(this.queryRunner);
  }
}
