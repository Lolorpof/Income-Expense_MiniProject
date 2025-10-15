import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoneyModule } from './money/money.module';
import { DeSerializerGuard } from './auth/middleware/deSerializer.fake.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MoneyModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: DeSerializerGuard }],
})
export class AppModule {}
