import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { serialize } from 'node:v8';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private readonly userSerivce: UserService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    // if there's session (logged in already)
    if (req.session.user) {
      const currentUser = await this.userSerivce.findById(req.session.user.id);
      this.authService.deSerializer(req.user, currentUser);
      return false;
    }

    // no user logged in yet
    this.authService.deSerializer(req.user, undefined);
    return true;
  }
}
