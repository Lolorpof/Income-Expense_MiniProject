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
import { TUser } from 'src/user/types/type';
import {
  TDeleteListing,
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
      .limit(1);

    if (!entry[0]) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Entry doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    const listings = await this.database
      .select()
      .from(schema.moneyListsPerDayTable)
      .where(eq(schema.moneyListsPerDayTable.moneyDailyId, entry[0].id));

    const listingsEntry = { entry: entry[0], listings };

    // no entries existed
    if (!listingsEntry || !listingsEntry.entry.id) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Listing doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    return listingsEntry;
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
        message: "Entry for the Day doesn't existed",
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

    // update total in entry of day
    const curEntry = checkEntry[0];
    const curListing = createdListForDay[0];
    const newTotalSpent = curListing.isSpent
      ? curEntry.totalSpent + -1 * curListing.spentOrEarned
      : curEntry.totalSpent;
    const newTotalEarned = curListing.isSpent
      ? curEntry.totalEarned
      : curEntry.totalEarned + curListing.spentOrEarned;
    const newNetTotal = newTotalEarned - newTotalSpent;
    await this.database.update(schema.moneyDailyTable).set({
      totalSpent: newTotalSpent,
      totalEarned: newTotalEarned,
      netTotal: newNetTotal,
    });

    return curListing;
  }

  async deleteListPerDay(listingId: string): Promise<TDeleteListing> {
    // delete listing from db
    const deletedListing = await this.database
      .delete(schema.moneyListsPerDayTable)
      .where(eq(schema.moneyListsPerDayTable.id, listingId))
      .returning();

    // nothing is deleted or no Id
    if (
      !deletedListing ||
      deletedListing.length === 0 ||
      !deletedListing[0].moneyDailyId
    ) {
      const response: TApiResponse<undefined> = {
        ok: false,
        message: "Listing doesn't existed",
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
      throw new BadRequestException(response);
    }

    // check if entry still have listings left
    const listings = await this.database
      .select()
      .from(schema.moneyListsPerDayTable)
      .where(
        eq(
          schema.moneyListsPerDayTable.moneyDailyId,
          deletedListing[0].moneyDailyId,
        ),
      )
      .limit(1);

    // no listings left after delete, delete entry for day
    if (!listings || listings.length === 0) {
      await this.database
        .delete(schema.moneyDailyTable)
        .where(eq(schema.moneyDailyTable.id, deletedListing[0].moneyDailyId));
    }

    // listings still existed, update total of entry for day
    const goneListing = deletedListing[0];
    if (listings.length && goneListing.moneyDailyId) {
      const entry = await this.database
        .select()
        .from(schema.moneyDailyTable)
        .where(eq(schema.moneyDailyTable.id, goneListing.moneyDailyId));
      const curEntry = entry[0];
      const newTotalSpent = goneListing.isSpent
        ? curEntry.totalSpent + goneListing.spentOrEarned // spent is stored as (-) in listing, so -(-) is +
        : curEntry.totalSpent;
      const newTotalEarned = goneListing.isSpent
        ? curEntry.totalEarned
        : curEntry.totalEarned - goneListing.spentOrEarned;
      const newNetTotal = newTotalEarned - newTotalSpent;
      await this.database
        .update(schema.moneyDailyTable)
        .set({
          totalSpent: newTotalSpent,
          totalEarned: newTotalEarned,
          netTotal: newNetTotal,
        })
        .where(eq(schema.moneyDailyTable.id, goneListing.moneyDailyId));
    }

    const res = {
      entryEmpty: listings.length === 0 ? true : false,
      ...deletedListing[0],
    };

    return res;
  }
}
