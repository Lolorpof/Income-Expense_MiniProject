import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { isTServiceResponse } from 'src/utils/types/api.types';
import { TUser, TUserSession } from 'src/user/types/type';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  serializer(
    reqSessionObj: FastifyRequest['session'],
    session: TUserSession | undefined,
  ) {
    reqSessionObj.user = session;
  }

  deSerializer(reqUserObj: FastifyRequest['user'], user: TUser | undefined) {
    reqUserObj = user;
  }

  async validateUser(username: string, password: string): Promise<TUser> {
    const user = await this.userService.findExact(username, password);

    if (isTServiceResponse(user)) {
      throw new UnauthorizedException(user.message);
    }

    return user;
  }
}
