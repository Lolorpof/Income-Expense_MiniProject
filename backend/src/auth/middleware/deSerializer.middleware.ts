import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../../user/user.service';

@Injectable()
export class DeSerializerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(
    req: FastifyRequest, //['raw'],
    _res: FastifyReply, //['raw'],
    next: (error?: any) => void,
  ) {
    console.log(`deSerialize MIDDLEWARE logged!!! session: ${req.session}`);
    // check session
    // existed
    if (req.session.user) {
      const currentUser = await this.userService.findById(req.session.user.id);
      req.user = currentUser;
    }
    // not existed
    else {
      req.user = undefined;
    }

    next();
  }
}
