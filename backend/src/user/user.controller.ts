import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/utils/zod/validation.pipe';
import { registerUserDto, registerUserSchema } from './types/dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Token } from 'src/auth/decoratorParam/token.decorator';
import { TRegisteredUser, TUser } from './types/type';
import { TApiResponse } from 'src/utils/types/api.types';
import { LoginGuard } from 'src/auth/guard/login.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseGuards(LoginGuard)
  async register(
    @Body(new ZodValidationPipe(registerUserSchema))
    registerUserDto: registerUserDto,
    @Res() res: FastifyReply,
  ): Promise<any> {
    const newUser = await this.userService.add(
      registerUserDto.username,
      registerUserDto.password,
    );

    const response: TApiResponse<TRegisteredUser> = {
      ok: true,
      message: 'Successfully registered user!',
      statusCode: 201,
      data: newUser,
    };

    res.status(201).send(response);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  async getCurrent(
    @Token() user: TUser,
    @Res() res: FastifyReply,
  ): Promise<any> {
    const { password, ...saveUser } = user;
    const response: TApiResponse<Omit<TUser, 'password'>> = {
      ok: true,
      message: 'User is logged in!',
      statusCode: 200,
      data: saveUser,
    };
    res.send(response);
  }
}
