import {
  ModelDirty,
  ModelHidden,
  Model,
  EntityDataSource,
  Procedure
} from '@rolster/typescript-hexagonal';
import { EntityManager, QueryRunner } from 'typeorm';

type ManagerCallback = (entities: EntityManager) => Promise<void>;

export abstract class TypeormEntityDataSource extends EntityDataSource {
  abstract setRunner(runner: QueryRunner): void;
}

export class RolsterTypeormEntityDataSource
  implements TypeormEntityDataSource
{
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public insert(model: Model): Promise<void> {
    return this.managerCallback((manager) =>
      manager.save(model).then(() => Promise.resolve())
    );
  }

  public update(model: Model, dirty?: ModelDirty): Promise<void> {
    return this.managerCallback((manager) =>
      dirty
        ? manager
            .update(model.constructor, { id: model.id }, dirty)
            .then(() => Promise.resolve())
        : manager.save(model).then(() => Promise.resolve())
    );
  }

  public delete(model: Model): Promise<void> {
    return this.managerCallback((manager) =>
      manager.remove(model).then(() => Promise.resolve())
    );
  }

  public hidden(model: ModelHidden): Promise<void> {
    return this.managerCallback((manager) => {
      model.hiddenAt = new Date();
      model.hidden = true;

      return manager
        .update(model.constructor, { id: model.id }, model)
        .then(() => Promise.resolve());
    });
  }

  public procedure(procedure: Procedure): Promise<void> {
    return this.managerCallback((manager) => procedure.execute(manager));
  }

  private managerCallback(callback: ManagerCallback): Promise<void> {
    return this.runner ? callback(this.runner.manager) : Promise.resolve();
  }
}
