import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
