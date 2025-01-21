import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DatabaseService } from 'src/database/database.service';

dotenv.config();

const configService = new ConfigService();

const databaseService = new DatabaseService(configService);

const dataSource = databaseService.getDataSource();

export = dataSource;
