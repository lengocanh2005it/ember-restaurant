import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
