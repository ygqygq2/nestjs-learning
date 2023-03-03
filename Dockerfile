FROM node:19 as builder

LABEL maintainer "29ygq@sina.com"

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM node:19-alpine

WORKDIR /app

COPY --from=builder /app/dist .

VOLUME [ "/app/logs" ]

EXPOSE 3000

CMD [ "npm" , "run", "start:prod"]
