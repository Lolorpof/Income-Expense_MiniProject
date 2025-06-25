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
import { TApiResponse } from 'src/utils/types/api.types';
import { TSerializedUser } from 'src/user/types/type';
import { LoginGuard } from './guard/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('user/login')
  @UseGuards(LoginGuard)
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
    session.user = { id };

    const response: TApiResponse<undefined> = {
      message: 'User logged in succesfully!',
      statusCode: 200,
    };
    res.send(response);
  }
}
