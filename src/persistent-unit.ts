import { PersistentUnit } from '@rolster/vinegar';
import { TypeormEntityDatabase } from './database';
import { TypeormEntityManager } from './entity-manager';
import { createRunner } from './sql-manager';

export class TypeormPersistentUnit implements PersistentUnit {
  constructor(
    private database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      const runner = createRunner();

      if (runner) {
        this.database.setRunner(runner);
        this.manager.setRunner(runner);

        await this.database.connect();
        await this.database.transaction();
        await this.manager.flush();
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
