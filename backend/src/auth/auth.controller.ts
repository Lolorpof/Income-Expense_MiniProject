import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodValidationPipe } from 'src/utils/zod/validation.pipe';
import { AuthService } from './auth.service';
import { loginUserDto, loginUserSchema } from './types/dto';
import { Session } from './decoratorParam/session.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user/login')
  async login(
    @Body(new ZodValidationPipe(loginUserSchema)) loginUserDto: loginUserDto,
    @Session() session: FastifyRequest['session'],
    @Res() res: FastifyReply,
  ) {
    const { id } = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    // serialized session
    this.authService.serializer(session, { id });
  }
}
