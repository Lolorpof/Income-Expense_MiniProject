import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import * as schema from './schema';
import { TCreateDate } from './types/type';
import { eq } from 'drizzle-orm';

@Injectable()
export class MoneyService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createDate(date: string): Promise<any> {
    // check if money-date already existed
    const checkDate = this.database
      .select({})
      .from(schema.moneyDailyTable)
      .where(eq(schema.moneyDailyTable.date, date))
      .limit(1);

    // await this.database.insert();
  }
}
