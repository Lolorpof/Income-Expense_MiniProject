import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
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
      throw new BadRequestException({
        ok: false,
        message: 'User is already logged in',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // check deSerialized user, not existed
    return true;
  }
}
