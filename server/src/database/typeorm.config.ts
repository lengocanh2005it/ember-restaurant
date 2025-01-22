import { DatabaseService } from 'src/database/database.service';

const databaseService = new DatabaseService();

const dataSource = databaseService.getDataSource();

export = dataSource;
