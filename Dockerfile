FROM node:10 AS base
RUN mkdir /tmp/cache
WORKDIR herakles


#
FROM base AS node_modules
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --frozen-lockfile --cache-folder /tmp/cache


#
FROM node_modules AS source
COPY . .

#
FROM source AS build
RUN yarn build

#
FROM build as run
ENTRYPOINT yarn start
