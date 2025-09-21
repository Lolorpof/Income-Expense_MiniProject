FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-alpine AS prod
WORKDIR /app
RUN apk add --no-cache curl postgresql-client dos2unix
RUN npm install -g pnpm
COPY package*.json .
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
# copy necessary file for db migration into ./temp, which will be removed during runtime after migration
COPY --from=build /app/node_modules ./temp/node_modules
COPY --from=build /app/drizzle ./temp/drizzle
COPY --from=build /app/src ./temp/src
COPY --from=build /app/scripts ./temp/scripts
COPY --from=build /app/.env ./temp
COPY --from=build /app/drizzle.config.ts ./temp
COPY --from=build /app/package*.json ./temp
COPY --from=build /app/pnpm-lock.yaml ./temp

RUN pnpm prune --prod
RUN dos2unix ./temp/scripts/init.sh
RUN chmod +x ./temp/scripts/init.sh
EXPOSE 6900
ENTRYPOINT [ "./temp/scripts/init.sh" ]
CMD ["npm", "run", "start:prod"]