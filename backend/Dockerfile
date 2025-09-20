FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm prune --omit=dev

FROM node:22-alpine AS prod
WORKDIR /app
COPY package*.json .
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 6900
CMD ["npm", "run", "start:prod"]