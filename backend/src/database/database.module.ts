import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ADMIN_CONNECTION, DATABASE_CONNECTION } from './database.connection';
import { ConfigService } from '@nestjs/config';
import * as userSchema from '../user/schema';
import { Pool } from 'pg';
import { DatabaseUrl } from './database.url';

const dbSchemas = {
  ...userSchema,
};

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (dbUrl: DatabaseUrl) => {
        const pool = new Pool({
          connectionString: dbUrl.dbUrl(),
        });

        return drizzle(pool, { schema: dbSchemas });
      },
      inject: [DatabaseUrl],
    },
    {
      provide: ADMIN_CONNECTION,
      useFactory: (dbUrl: DatabaseUrl) => {
        const pool = new Pool({
          connectionString: dbUrl.adminUrl(),
        });

        return drizzle(pool, { schema: dbSchemas });
      },
      inject: [DatabaseUrl],
    },
    DatabaseUrl,
  ],
  exports: [ADMIN_CONNECTION, DATABASE_CONNECTION],
})
export class DatabaseModule {}
