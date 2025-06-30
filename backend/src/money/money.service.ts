import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import * as schema from './schema';
import { and, eq } from 'drizzle-orm';
import dayjs from 'dayjs';
import { TUser } from 'src/user/types/type';
import { TIncExpDaily, TIncExpDateId } from './types/type';
import { TApiResponse } from 'src/utils/types/api.types';

@Injectable()
export class MoneyService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getAllByUserId(currentUser: TUser): Promise<TIncExpDateId[]> {
    // get all entries by user id
    const entries = await this.database
      .select({
        id: schema.moneyDailyTable.id,
        date: schema.moneyDailyTable.date,
      })
      .from(schema.moneyDailyTable)
      .where(eq(schema.moneyDailyTable.userId, currentUser.id));

    return entries;
  }

  async getById(id: string): Promise<TIncExpDaily> {
    const entry = await this.database
      .select()
      .from(schema.moneyDailyTable)
      .where(eq(schema.moneyDailyTable.id, id));

    // no entry existed
    if (!entry[0]) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Entry doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    return entry[0];
  }

  async getByDate(date: string): Promise<TIncExpDaily> {
    const entry = await this.database
      .select()
      .from(schema.moneyDailyTable)
      .where(eq(schema.moneyDailyTable.date, date));

    // no entry existed
    if (!entry[0]) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Entry doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    return entry[0];
  }

  async createIncExpDaily(
    date: Date,
    currentUser: TUser,
  ): Promise<TIncExpDaily> {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    // check if money-date for current user already existed
    const checkEntries = await this.database
      .select()
      .from(schema.moneyDailyTable)
      .where(
        and(
          eq(schema.moneyDailyTable.date, formattedDate),
          eq(schema.moneyDailyTable.userId, currentUser.id),
        ),
      );

    const checkEntry = checkEntries[0];

    // entry already existed
    if (checkEntry) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: 'Entry already existed',
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    // no entry, create new one
    const createdEntry = await this.database
      .insert(schema.moneyDailyTable)
      .values({ date: formattedDate, userId: currentUser.id })
      .returning();
    return createdEntry[0];
  }
}
