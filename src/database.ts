import { EntityDatabase } from '@rolster/vinegar';
import { QueryRunner } from 'typeorm';

type ResolveRunner = (runner: QueryRunner) => Promise<void>;

export abstract class TypeormEntityDatabase extends EntityDatabase {
  abstract setRunner(runner: QueryRunner): void;
}

export class RolsterTypeormEntityDatabase implements TypeormEntityDatabase {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public connect(): Promise<void> {
    return this.resolver((runner) => runner.connect());
  }

  public disconnect(_?: boolean): Promise<void> {
    return this.resolver((runner) => runner.release());
  }

  public transaction(): Promise<void> {
    return this.resolver((runner) => runner.startTransaction());
  }

  public commit(): Promise<void> {
    return this.resolver((runner) => runner.commitTransaction());
  }

  public rollback(): Promise<void> {
    return this.resolver((runner) => runner.rollbackTransaction());
  }

  private resolver(resolve: ResolveRunner): Promise<void> {
    return this.runner ? resolve(this.runner) : Promise.resolve();
  }
}
