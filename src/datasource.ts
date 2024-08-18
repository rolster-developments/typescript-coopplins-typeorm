import { voidPromise } from '@rolster/commons';
import {
  ModelDirty,
  ModelHidden,
  Model,
  EntityDataSource,
  Procedure
} from '@rolster/vinegar';
import { EntityManager, QueryRunner } from 'typeorm';

type ResolveManager = (entities: EntityManager) => Promise<void>;

export abstract class TypeormEntityDataSource extends EntityDataSource {
  abstract setRunner(runner: QueryRunner): void;
}

export class RolsterTypeormEntityDataSource implements TypeormEntityDataSource {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public insert(model: Model): Promise<void> {
    return this.resolver((manager) => voidPromise(manager.save(model)));
  }

  public update(model: Model, dirty?: ModelDirty): Promise<void> {
    return this.resolver((manager) =>
      dirty
        ? voidPromise(
            manager.update(model.constructor, { id: model.id }, dirty)
          )
        : voidPromise(manager.save(model))
    );
  }

  public delete(model: Model): Promise<void> {
    return this.resolver((manager) => voidPromise(manager.remove(model)));
  }

  public hidden(model: ModelHidden): Promise<void> {
    return this.resolver((manager) => {
      model.hiddenAt = new Date();
      model.hidden = true;

      return voidPromise(
        manager.update(model.constructor, { id: model.id }, model)
      );
    });
  }

  public procedure(procedure: Procedure): Promise<void> {
    return this.resolver((manager) => procedure.execute(manager));
  }

  private resolver(resolve: ResolveManager): Promise<void> {
    return this.runner ? resolve(this.runner.manager) : Promise.resolve();
  }
}
