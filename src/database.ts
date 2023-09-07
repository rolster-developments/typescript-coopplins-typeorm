import { EntityDatabase } from '@rolster/typescript-hexagonal';
import { QueryRunner } from 'typeorm';

type RunnerCallback = (runner: QueryRunner) => Promise<void>;

export abstract class TypeormEntityDatabase extends EntityDatabase {
  abstract setRunner(runner: QueryRunner): void;
}

export class RolsterTypeormEntityDatabase implements TypeormEntityDatabase {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public connect(): Promise<void> {
    return this.runnerCallback((runner) => runner.connect());
  }

  public disconnect(_?: boolean): Promise<void> {
    return this.runnerCallback((runner) => runner.release());
  }

  public transaction(): Promise<void> {
    return this.runnerCallback((runner) => runner.startTransaction());
  }

  public commit(): Promise<void> {
    return this.runnerCallback((runner) => runner.commitTransaction());
  }

  public rollback(): Promise<void> {
    return this.runnerCallback((runner) => runner.rollbackTransaction());
  }

  private runnerCallback(callback: RunnerCallback): Promise<void> {
    return this.runner ? callback(this.runner) : Promise.resolve();
  }
}
