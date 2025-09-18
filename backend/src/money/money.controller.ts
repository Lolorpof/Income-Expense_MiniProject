import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Token } from 'src/auth/decoratorParam/token.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TUser } from 'src/user/types/type';
import {
  createIncExpDailyDto,
  createIncExpDailySchema,
  createIncExpListingDto,
  createIncExpListingSchema,
} from './types/dto';
import { ZodValidationPipe } from 'src/utils/zod/validation.pipe';
import { MoneyService } from './money.service';
import { TApiResponse } from 'src/utils/types/api.types';
import {
  TIncExpDaily,
  TIncExpDateId,
  TIncExpList,
  TListingEntriesComb,
} from './types/type';
import dayjs from 'dayjs';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Get('auth/getAll')
  @UseGuards(AuthGuard)
  async getAllByUserId(@Token() user: TUser, @Res() res: FastifyReply) {
    const entries = await this.moneyService.getAllByUserId(user);

    const response: TApiResponse<TIncExpDateId[]> = {
      ok: true,
      message: 'Successfully retrieve entries',
      statusCode: 200,
      data: entries,
    };
    res.status(response.statusCode).send(response);
  }

  @Get('auth/get/:date')
  @UseGuards(AuthGuard)
  async getEntryByDate(
    @Param('date') date: string,
    @Token() user: TUser,
    @Res() res: FastifyReply,
  ) {
    const entry = await this.moneyService.getEntryByDate(date, user.id);

    const response: TApiResponse<TListingEntriesComb> = {
      ok: true,
      message: 'Successfully retrieve entry',
      statusCode: 200,
      data: entry,
    };
    res.status(response.statusCode).send(response);
  }

  @Post('auth/create')
  @UseGuards(AuthGuard)
  async create(
    @Token() user: TUser,
    @Body(new ZodValidationPipe(createIncExpDailySchema))
    createIncExpDailyDto: createIncExpDailyDto,
    @Res() res: FastifyReply,
  ) {
    const formattedDate = dayjs(createIncExpDailyDto.date).format('YYYY-MM-DD');
    const createdEntry = await this.moneyService.createIncExpDaily(
      formattedDate,
      user,
    );

    console.log(`at money controller date: ${formattedDate}`);

    const response: TApiResponse<TIncExpDaily> = {
      ok: true,
      message: 'Successfully create entry',
      statusCode: 201,
      data: createdEntry,
    };
    res.status(response.statusCode).send(response);
  }

  @Post('auth/create/listing')
  @UseGuards(AuthGuard)
  async createListing(
    @Body(new ZodValidationPipe(createIncExpListingSchema))
    createIncExpListingDto: createIncExpListingDto,
    @Res() res: FastifyReply,
  ) {
    const { moneyDailyId, ...formattedBody } = createIncExpListingDto;
    const createdListForDay = await this.moneyService.createListPerDay(
      formattedBody,
      createIncExpListingDto.moneyDailyId,
    );

    const response: TApiResponse<TIncExpList> = {
      ok: true,
      message: 'Successfully insert listing into day entry',
      statusCode: 201,
      data: createdListForDay,
    };

    res.status(response.statusCode).send(response);
  }
}
