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
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  // get Adapter and Instance
  const fastifyAdapter = new FastifyAdapter({
    logger: { level: 'info', transport: { target: 'pino-pretty' } },
  });
  const fastifyInstance = fastifyAdapter.getInstance();

  // register plugins BEFORE Nest bootstrap app
  await fastifyInstance.register(fastifyCors, {
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  await fastifyInstance.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET as string,
  });

  await fastifyInstance.register(fastifySession, {
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    cookieName: process.env.COOKIE_NAME as string,
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

  // bootstrap Nest app AFTER register plugins
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
