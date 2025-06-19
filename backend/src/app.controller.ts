import { Controller, Get, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  @Get()
  index(@Res() res: FastifyReply) {
    res.status(400).send({ message: 'Hello World', statusCode: 400 });
  }
}
