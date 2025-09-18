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
  id: string;
  listingId: string;
  userId: string | null;
  date: string;
  totalSpent: number;
  totalEarned: number;
  action: string;
  time: string;
  spentOrEarned: number;
  isSpent: boolean;
}[];
