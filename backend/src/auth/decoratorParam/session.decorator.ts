import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Session = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    return req.session;
  },
);
