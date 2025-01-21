import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

@Injectable()
export class DatabaseService {
  private dataSource: DataSource;

  constructor(private readonly configService: ConfigService) {
    const dataSourceOptions: DataSourceOptions = this.getDataSourceOptions();
    this.dataSource = new DataSource(dataSourceOptions);
  }

  getDataSourceOptions(): DataSourceOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('MYSQL_ROOT_PASSWORD'),
      database: this.configService.get<string>('MYSQL_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      logging: false,
      synchronize: false,
    };
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }
}
