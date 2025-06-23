import { Body, Controller, Get, Post, Res, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/utilities/zod/validation.pipe';
import { registerUserDto, registerUserSchema } from './types/dto';
import { FastifyReply } from 'fastify';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(
    @Body() registerUserDto: registerUserDto,
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
}
