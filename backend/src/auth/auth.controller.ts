import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ZodValidationPipe } from 'src/utilities/zod/validation.pipe';

@Controller('auth')
export class AuthController {
  @Post('login')
  // @UseGuards()
  async login(@Req() req: FastifyRequest) {}
}
