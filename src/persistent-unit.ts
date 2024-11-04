import { AbstractPersistentUnit } from '@rolster/vinegar';
import { EntityDatabase } from './database';
import { AbstractTypeormEntityManager } from './entity-manager';
import { AbstractTypeormVinegar, getCurrentVinegar } from './typeorm-manager';

export abstract class PersistentUnit extends AbstractPersistentUnit {
  abstract setTypeorm(typeorm: AbstractTypeormVinegar): void;
}

export class TypeormPersistentUnit implements PersistentUnit {
  private typeorm?: AbstractTypeormVinegar;

  constructor(
    private database: EntityDatabase,
    public readonly manager: AbstractTypeormEntityManager
  ) {}

  public setTypeorm(typeorm: AbstractTypeormVinegar): void {
    this.typeorm = typeorm;
  }

  public async flush(): Promise<void> {
    try {
      const vinegar = this.typeorm || getCurrentVinegar();
      const queryRunner = vinegar.createQueryRunner();

      if (queryRunner) {
        this.database.setQueryRunner(queryRunner);
        this.manager.setQueryRunner(queryRunner);

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
