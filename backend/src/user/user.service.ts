import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  ADMIN_CONNECTION,
  DATABASE_CONNECTION,
} from 'src/database/database.connection';
import * as schema from './schema';
import { and, eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { TRegisteredUser, TUser } from './types/type';
import bcrypt from 'bcrypt';
import { TServiceResponse } from 'src/utils/types/api.types';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly cfgService: ConfigService,
  ) {}

  async findExact(
    username: string,
    password: string,
  ): Promise<TUser | TServiceResponse> {
    const users = await this.database
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.username, username))
      .limit(1);

    const user = users[0];
    // no user
    if (!user) {
      return { message: 'No user with this username existed' };
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    // wrong password
    if (!comparePassword) {
      return { message: 'Incorrect password' };
    }

    return user;
  }

  async findById(id: string): Promise<TUser> {
    const users = await this.database
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.id, id));

    const user = users[0];

    // user not found by id
    if (!user) {
      console.log(`Not found parameter id = ${id}`);
      throw new BadRequestException({
        ok: false,
        message: "User isn't found by id",
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // user found
    return user;
  }

  async add(username: string, password: string): Promise<TRegisteredUser> {
    // console.log(this.database);
    // dupe username check
    const dupedUsername = await this.database
      .select({ id: schema.userTable.id, username: schema.userTable.username })
      .from(schema.userTable)
      .where(eq(schema.userTable.username, username));
    if (dupedUsername[0]) {
      throw new BadRequestException({
        ok: false,
        message: 'Username already existed, please use another username',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // add new user to database
    const hashedPassword = await bcrypt.hash(
      password,
      Number(this.cfgService.getOrThrow('SALTROUND')),
    );
    const newUser = await this.database
      .insert(schema.userTable)
      .values({ username: username, password: hashedPassword })
      .returning({
        id: schema.userTable.id,
        username: schema.userTable.username,
      });

    // console.log(`new user: ${newUser}`);

    return newUser[0];
  }
}
