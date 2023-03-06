###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:19 As development
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY --chown=node:node pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################
FROM node:19 As builder
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN pnpm run build

ENV NODE_ENV production

RUN pnpm install --prod --ignore-scripts

USER node

###################
# PRODUCTION
###################
FROM node:19-alpine As production
LABEL maintainer "29ygq@sina.com"
ENV NODE_ENV production
WORKDIR /app
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node .env .env.production ./

VOLUME [ "/app/logs" ]
EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]
