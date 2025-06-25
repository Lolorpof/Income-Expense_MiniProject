// Technically not a guard lol

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from 'src/user/user.service';

@Injectable()
export class deSerializerGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    // check session, not existed
    if (!req.session.user) {
      req.user = undefined;
    }
    // check session, existed
    else {
      const currentUser = await this.userService.findById(req.session.user.id);
      req.user = currentUser;
    }

    return true;
  }
}
