import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
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
import { LoginGuard } from './guard/login.guard';
import { AuthGuard } from './guard/auth.guard';
import { fastifySession } from '@fastify/session';
import { Token } from './decoratorParam/token.decorator';
import { TSerializedUser, TUser } from 'src/user/types/type';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
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
      ok: true,
      message: 'User logged in succesfully!',
      statusCode: 200,
    };
    res.send(response);
  }

  @Post('user/logout')
  @UseGuards(AuthGuard)
  async logout(
    @Token() user: TUser,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    req.session.destroy((err) => {
      if (err) {
        throw new BadRequestException({
          ok: false,
          message: 'An error occured when logging out',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      res.clearCookie(this.configService.getOrThrow('COOKIE_NAME'));
      const response: TApiResponse<TSerializedUser> = {
        ok: true,
        message: 'Succesfully logged out!',
        statusCode: 200,
        data: { id: user.id },
      };
      res.send(response);
    });
  }
}
