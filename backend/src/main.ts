import 'dotenv/config';
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
import { UserService } from './user/user.service';
import { deSerializerPlugin } from './auth/plugin/deSerializer.plugin';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: { level: 'info', transport: { target: 'pino-pretty' } },
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
    cookie: { secure: false, maxAge: Number(process.env.SESSION_DEV_AGE) },
    store: new PgSessionStore({
      pool: pool,
      tableName: 'user_session',
      createTableIfMissing: true,
      pruneSessionInterval: 60,
    }),
  });

  // ***trying to implement via hooks as plugin but failed
  // const userService = app.get(UserService);
  // await fastifyInstance.register(deSerializerPlugin(userService));

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
