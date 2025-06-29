import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
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
      throw new UnauthorizedException({
        ok: false,
        message: "User isn't logged in",
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // check deSerialized user, existed
    return true;
  }
}
