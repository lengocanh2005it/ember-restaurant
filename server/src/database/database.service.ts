import { Injectable } from '@nestjs/common';
import { getEnvValue } from 'src/utils';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class DatabaseService {
  private dataSource: DataSource;

  constructor() {
    const dataSourceOptions: DataSourceOptions = this.getDataSourceOptions();
    this.dataSource = new DataSource(dataSourceOptions);
  }

  getDataSourceOptions(): DataSourceOptions {
    return {
      type: 'mysql',
      host: getEnvValue('DB_HOST_PROD', 'DB_HOST_DEV'),
      port: +getEnvValue('DB_PORT_PROD', 'DB_PORT_DEV'),
      username: getEnvValue('DB_USERNAME_PROD', 'DB_USERNAME_DEV'),
      password: getEnvValue(
        'MYSQL_ROOT_PASSWORD_PROD',
        'MYSQL_ROOT_PASSWORD_DEV',
      ),
      database: getEnvValue('MYSQL_DATABASE_PROD', 'MYSQL_DATABASE_DEV'),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      logging: false,
      synchronize: false,
    };
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }
}
