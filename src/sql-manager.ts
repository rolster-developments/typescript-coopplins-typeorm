import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository
} from 'typeorm';

class VinegarSql {
  private dataSource?: DataSource;

  public setDataSource(dataSource: DataSource): void {
    this.dataSource = dataSource;
  }

  public getDataSource(): Undefined<DataSource> {
    return this.dataSource;
  }

  public createRunner(): Undefined<QueryRunner> {
    return this.dataSource?.createQueryRunner();
  }

  public repository<T extends ObjectLiteral>(
    target: EntityTarget<T>
  ): Undefined<Repository<T>> {
    return this.dataSource?.getRepository<T>(target);
  }
}

const vinegarSql = new VinegarSql();

export function setDataSource(dataSource: DataSource): void {
  vinegarSql.setDataSource(dataSource);
}

export function getDataSource(): Undefined<DataSource> {
  return vinegarSql.getDataSource();
}

export function createRunner(): Undefined<QueryRunner> {
  return vinegarSql.createRunner();
}

export function createRepository<T extends ObjectLiteral>(
  target: EntityTarget<T>
): Repository<T> {
  const repository = vinegarSql.repository(target);

  if (!repository) {
    throw Error(
      "Sorry, we can't perform data queries because DataSource is undefined"
    );
  }

  return repository;
}
