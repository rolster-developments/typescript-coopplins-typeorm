import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository
} from 'typeorm';

class VinegarTypeormSql {
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

export const VinegarSql = new VinegarTypeormSql();
