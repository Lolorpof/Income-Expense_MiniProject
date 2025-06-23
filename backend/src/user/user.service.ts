import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  ADMIN_CONNECTION,
  DATABASE_CONNECTION,
} from 'src/database/database.connection';
import * as schema from './schema';
import { and, eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject(ADMIN_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async add(username: string, password: string): Promise<any> {
    console.log(this.database);
    // dupe username check
    const dupedUsername = await this.database.query.userTable.findFirst({
      where: eq(schema.userTable.username, username),
    });

    if (dupedUsername) {
      throw new BadRequestException(
        'Username already existed, please use another username',
      );
    }

    // add new user to database
    const newUser = await this.database
      .insert(schema.userTable)
      .values({ username: username, password: password })
      .returning({
        id: schema.userTable.id,
        username: schema.userTable.username,
      });

    console.log(`new user: ${newUser}`);

    return newUser[0];
  }

  async findExact(username: string, password: string): Promise<any> {}
}
