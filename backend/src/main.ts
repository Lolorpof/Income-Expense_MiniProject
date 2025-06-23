import 'dotenv/config';
import fastifyExpress from '@fastify/express';
import session from 'express-session';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: { transport: { target: 'pino-pretty' } },
    }),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();
  if (typeof fastifyInstance.use !== 'function') {
    await fastifyInstance.register(fastifyExpress);
  }

  app.use(
    session({ secret: 'lolz123', resave: false, saveUninitialized: false }),
  );

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
