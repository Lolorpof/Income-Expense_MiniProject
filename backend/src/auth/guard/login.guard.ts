import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class LoginGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    // throw custom exceptions
    if (req.user) {
      throw new BadRequestException('User is already logged in');
    }

    // check deSerialized user, not existed
    return true;
  }
}
