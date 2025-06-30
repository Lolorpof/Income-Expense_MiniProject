import { InferSelectModel } from 'drizzle-orm';
import * as schema from '../schema';

// database
export type TIncExpDaily = InferSelectModel<typeof schema.moneyDailyTable>;

export type TIncExpList = InferSelectModel<typeof schema.moneyListsPerDayTable>;

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
