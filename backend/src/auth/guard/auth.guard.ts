import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    // throw custom exceptions
    if (!req.user) {
      throw new UnauthorizedException("User isn't logged in");
    }

    // check deSerialized user, existed
    return true;
  }
}
