import pgSession from 'connect-pg-simple';
import fastifySession from '@fastify/session';
import { Pool } from 'pg';

export const PgSessionStore = pgSession(fastifySession as any);

export const pool = new Pool({
  connectionString: `postgres://${process.env.POSTGRES_SUPER_USER}:${process.env.POSTGRES_SUPER_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});
