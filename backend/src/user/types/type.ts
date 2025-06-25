import { PgTable } from 'drizzle-orm/pg-core';
import * as schema from '../schema';
import { InferSelectModel } from 'drizzle-orm';

// database types
export type TUser = InferSelectModel<typeof schema.userTable>;

// extra types
export type TRegisteredUser = { id: string; username: string };

export type TUserSession = { id: string };
