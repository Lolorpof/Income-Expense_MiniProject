import { InferSelectModel } from 'drizzle-orm';
import * as schema from '../schema';

// database
export type TIncExpDaily = InferSelectModel<typeof schema.moneyDailyTable>;

export type TIncExpList = InferSelectModel<typeof schema.moneyListsPerDayTable>;

export type TInsertList = Omit<
  TIncExpList,
  'id' | 'createdAt' | 'updatedAt' | 'isSpent' | 'moneyDailyId'
>;

// custom
export type TIncExpDateId = Omit<
  TIncExpDaily,
  | 'totalSpent'
  | 'totalEarned'
  | 'netTotal'
  | 'createdAt'
  | 'updatedAt'
  | 'userId'
>;

export type TListingEntriesComb = {
  entry: {
    id: string;
    date: string;
    totalSpent: number;
    totalEarned: number;
    netTotal: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string | null;
  };
  listings: {
    id: string;
    time: string;
    action: string;
    spentOrEarned: number;
    isSpent: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    moneyDailyId: string | null;
  }[];
};

export type TDeleteListing = TIncExpList & { entryEmpty: boolean };
