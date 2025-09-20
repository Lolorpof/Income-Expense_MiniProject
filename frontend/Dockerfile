FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile 
COPY . .
RUN pnpm run build

FROM nginx:1.29.1-alpine AS prod 
COPY ./nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html 