import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Token } from '../auth/decoratorParam/token.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { TUser } from '../user/types/type';
import {
  createIncExpDailyDto,
  createIncExpDailySchema,
  createIncExpListingDto,
  createIncExpListingSchema,
  deleteIncExpListingDto,
  deleteIncExpListingSchema,
  editIncExpListDto,
  editIncExpListSchema,
} from './types/dto';
import { ZodValidationPipe } from '../utils/zod/validation.pipe';
import { MoneyService } from './money.service';
import { TApiResponse } from '../utils/types/api.types';
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

  @Put('auth/edit/listing')
  @UseGuards(AuthGuard)
  async editListing(
    @Body(new ZodValidationPipe(editIncExpListSchema))
    editIncExpListDto: editIncExpListDto,
    @Res() res: FastifyReply,
  ) {
    const edittedListing = await this.moneyService.editListPerDay(
      editIncExpListDto.listingId,
      editIncExpListDto.action,
      editIncExpListDto.time,
      editIncExpListDto.spentOrEarned,
    );

    const response: TApiResponse<TIncExpList> = {
      ok: true,
      message: 'Successfully editted listing for the day',
      statusCode: 200,
      data: edittedListing,
    };

    res.status(response.statusCode).send(response);
  }

  @Delete('auth/delete/listing')
  @UseGuards(AuthGuard)
  async deleteListing(
    @Body(new ZodValidationPipe(deleteIncExpListingSchema))
    deleteIncExpListingDto: deleteIncExpListingDto,
    @Res() res: FastifyReply,
  ) {
    const deletedListing = await this.moneyService.deleteListPerDay(
      deleteIncExpListingDto.listingId,
    );

    const response: TApiResponse<TIncExpList> = {
      ok: true,
      message: 'Successfully delete listing for the day',
      statusCode: 200,
      data: deletedListing,
    };

    res.status(response.statusCode).send(response);
  }
}
