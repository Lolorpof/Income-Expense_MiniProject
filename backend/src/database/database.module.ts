import {
  HttpStatus,
  Module,
  ServiceUnavailableException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  ADMIN_CONNECTION,
  DATABASE_CONNECTION,
  USER_CONNECTION,
} from './database.connection';
import { ConfigService } from '@nestjs/config';
import * as userSchema from '../user/schema';
import { Pool } from 'pg';
import { DatabaseUrl } from './database.url';
import testPoolConnection from './database.test';
import { TApiResponse } from 'src/utils/types/api.types';

const dbSchemas = {
  ...userSchema,
};

@Module({
  providers: [
    {
      provide: USER_CONNECTION,
      useFactory: async (dbUrl: DatabaseUrl) => {
        const pool = new Pool({
          connectionString: dbUrl.dbUrl(),
        });

        if (!(await testPoolConnection(pool))) {
          console.error(dbUrl.dbUrl());
          const response: TApiResponse<undefined> = {
            ok: false,
            message: "Can't connect to database",
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Service Unavailable',
          };
          throw new ServiceUnavailableException(response);
        }

        return drizzle(pool, { schema: dbSchemas });
      },
      inject: [DatabaseUrl],
    },
    {
      provide: ADMIN_CONNECTION,
      useFactory: async (dbUrl: DatabaseUrl) => {
        const pool = new Pool({
          connectionString: dbUrl.adminUrl(),
        });

        if (!(await testPoolConnection(pool))) {
          console.error(dbUrl.adminUrl());
          const response: TApiResponse<undefined> = {
            ok: false,
            message: "Can't connect to database",
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Service Unavailable',
          };
          throw new ServiceUnavailableException(response);
        }

        return drizzle(pool, { schema: dbSchemas });
      },
      inject: [DatabaseUrl],
    },
    DatabaseUrl,
  ],
  exports: [ADMIN_CONNECTION, USER_CONNECTION],
})
export class DatabaseModule {}
