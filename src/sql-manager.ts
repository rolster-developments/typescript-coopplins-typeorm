import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository
} from 'typeorm';

class TypeormSql {
  private dataSource?: DataSource;

  public setDataSource(datasource: DataSource): void {
    this.dataSource = datasource;
  }

  public getDataSource(): Undefined<DataSource> {
    return this.dataSource;
  }

  public createRunner(): Undefined<QueryRunner> {
    return this.dataSource?.createQueryRunner();
  }

  public getRepository<T extends ObjectLiteral>(
    target: EntityTarget<T>
  ): Undefined<Repository<T>> {
    return this.dataSource?.getRepository<T>(target);
  }
}

export const typeormSql = new TypeormSql();
