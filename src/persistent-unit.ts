import { PersistentUnit } from '@rolster/typescript-hexagonal';
import { promisesZip } from '@rolster/typescript-utils';
import { TypeormEntityDatabase } from './database';
import { TypeormEntityManager } from './entity-manager';
import { typeormSql } from './sql-manager';

export class TypeormPersistentUnit implements PersistentUnit {
  constructor(
    private database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public flush(): Promise<void> {
    const runner = typeormSql.createRunner();

    if (!runner) {
      return Promise.resolve();
    }

    this.database.setRunner(runner);
    this.manager.setRunner(runner);

    return promisesZip([
      () => this.database.connect(),
      () => this.database.transaction(),
      () => this.manager.flush(),
      () => this.database.commit()
    ])
      .then(() => Promise.resolve())
      .catch((error) => {
        return this.database.rollback().finally(() => {
          throw error;
        });
      })
      .finally(() => {
        this.database.disconnect();
      });
  }

  public async flushAsync(): Promise<void> {
    try {
      const runner = typeormSql.createRunner();

      if (runner) {
        this.database.setRunner(runner);
        this.manager.setRunner(runner);

        await this.database.connect();
        await this.database.transaction();
        await this.manager.flushAsync();
        await this.database.commit();
      }
    } catch (error) {
      await this.database.rollback();

      throw error;
    } finally {
      await this.database.disconnect();
    }
  }
}
