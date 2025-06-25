import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/utils/zod/validation.pipe';
import { registerUserDto, registerUserSchema } from './types/dto';
import { FastifyReply } from 'fastify';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerUserSchema))
    registerUserDto: registerUserDto,
    @Res() res: FastifyReply,
  ): Promise<any> {
    const newUser = await this.userService.add(
      registerUserDto.username,
      registerUserDto.password,
    );

    res.status(201).send({
      message: 'Successfully registered user!',
      statusCode: 201,
      data: newUser,
    });
  }

  @Get('auth')
  @UseGuards(AuthGuard)
  async getCurrent(): Promise<any> {}
}
