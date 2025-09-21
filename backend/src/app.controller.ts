import { Controller, Get, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  @Get('health')
  index(@Res() res: FastifyReply) {
    res
      .status(200)
      .send({
        status: 'ok',
        ok: true,
        message: 'Service is healthy!',
        statusCode: 200,
      });
  }
}
