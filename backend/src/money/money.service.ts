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
import {
  TIncExpDaily,
  TIncExpDateId,
  TIncExpList,
  TInsertList,
  TListingEntriesComb,
} from './types/type';
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

  async getEntryByDate(
    date: string,
    userId: string,
  ): Promise<TListingEntriesComb> {
    const entry = await this.database
      .select()
      .from(schema.moneyDailyTable)
      .where(
        and(
          eq(schema.moneyDailyTable.date, date),
          eq(schema.moneyDailyTable.userId, userId),
        ),
      )
      .as('entry');

    const listingEntries = await this.database
      .select({
        id: entry.id,
        listingId: schema.moneyListsPerDayTable.id,
        userId: entry.userId,
        date: entry.date,
        totalSpent: entry.totalSpent,
        totalEarned: entry.totalEarned,
        action: schema.moneyListsPerDayTable.action,
        time: schema.moneyListsPerDayTable.time,
        spentOrEarned: schema.moneyListsPerDayTable.spentOrEarned,
        isSpent: schema.moneyListsPerDayTable.isSpent,
      })
      .from(schema.moneyListsPerDayTable)
      .innerJoin(
        entry,
        eq(schema.moneyListsPerDayTable.moneyDailyId, entry.id),
      );

    // no entries existed
    if (listingEntries.length === 0) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Entry doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    return listingEntries;
  }

  async createIncExpDaily(
    formattedDate: string,
    currentUser: TUser,
  ): Promise<TIncExpDaily> {
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

  async createListPerDay(
    listDailyForm: TInsertList,
    moneyDailyId: string,
  ): Promise<TIncExpList> {
    // check if the date entry doesn't existed
    const checkEntry = await this.database
      .select()
      .from(schema.moneyDailyTable)
      .where(eq(schema.moneyDailyTable.id, moneyDailyId));

    if (checkEntry && checkEntry.length === 0) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Entry for Day doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    // insert list
    const createdListForDay = await this.database
      .insert(schema.moneyListsPerDayTable)
      .values({
        action: listDailyForm.action,
        time: listDailyForm.time,
        spentOrEarned: listDailyForm.spentOrEarned,
        isSpent: listDailyForm.spentOrEarned < 0 ? true : false,
        moneyDailyId: moneyDailyId,
      })
      .returning();

    return createdListForDay[0];
  }
}
