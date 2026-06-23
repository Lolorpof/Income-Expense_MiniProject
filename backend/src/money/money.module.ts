import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MoneyService],
  controllers: [MoneyController],
})
export class MoneyModule {}
