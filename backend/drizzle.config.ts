import { defineConfig, Config } from 'drizzle-kit';

export default defineConfig({
  schema: './src/**/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${process.env.POSTGRES_SUPER_USER}:${process.env.POSTGRES_SUPER_PASSWORD}@${process.env.POSTGRES_HOST}:${(process.env.ENV as string) == 'DEV' ? process.env.POSTGRES_MAP_PORT : process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  },
}) as Config;
