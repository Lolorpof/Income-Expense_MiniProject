import {
  pgTable,
  uuid,
  date,
  time,
  real,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';

import * as userSchema from '../user/schema';

export const moneyDailyTable = pgTable('money_daily', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  totalSpent: real('total_spent').notNull().default(0),
  totalEarned: real('total_earned').notNull().default(0),
  netTotal: real('net_total').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  userId: uuid('user_id').references(() => userSchema.userTable.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
});

export const moneyListsPerDayTable = pgTable('money_list_per_day', {
  id: uuid('id').primaryKey().defaultRandom(),
  time: time('time').notNull(),
  action: varchar('action', { length: 512 }).notNull(),
  spentOrEarned: real('spent_or_earned').notNull().default(0),
  isSpent: boolean('isSpent').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  moneyDailyId: uuid('money_daily_id').references(() => moneyDailyTable.id, {
    onUpdate: 'cascade',
    onDelete: 'cascade',
  }),
});
