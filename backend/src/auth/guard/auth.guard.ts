import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    // check session and user is not logged in
    if (!req.session.user) {
      this.authService.deSerializer(req.user, undefined);
      return false;
    }

    // check session and user is logged in
    const currentUser = await this.userService.findById(req.session.user.id);
    this.authService.deSerializer(req.user, currentUser);
    return true;
  }
}
