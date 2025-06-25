import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Token = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
