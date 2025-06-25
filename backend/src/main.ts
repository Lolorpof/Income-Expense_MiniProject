import 'dotenv/config';
import fastifyExpress from '@fastify/express';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import './utils/session';
import { PgSessionStore, pool } from './utils/session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: { transport: { target: 'pino-pretty' } },
    }),
  );

  app.setGlobalPrefix('api');

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET as string,
  });

  await fastifyInstance.register(fastifySession, {
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 },
    store: new PgSessionStore({
      pool: pool,
      tableName: 'user_session',
      createTableIfMissing: true,
    }),
  });

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
