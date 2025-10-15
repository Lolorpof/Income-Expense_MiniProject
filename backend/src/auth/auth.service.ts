import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { isTServiceResponse } from 'src/utils/types/api.types';
import { TUser, TSerializedUser } from 'src/user/types/type';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  serializer(
    reqSessionObj: FastifyRequest['session'],
    session: TSerializedUser | undefined,
  ) {
    reqSessionObj.user = session;
  }

  async validateUser(username: string, password: string): Promise<TUser> {
    const user = await this.userService.findExact(username, password);

    if (isTServiceResponse(user)) {
      throw new UnauthorizedException({
        ok: false,
        message: user.message,
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return user;
  }
}
