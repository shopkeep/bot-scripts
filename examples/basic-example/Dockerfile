FROM node:10.7-alpine

ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json package-lock.json .npmrc /basic-example/
WORKDIR /basic-example/
RUN npm install

COPY . /basic-example/

RUN rm -f /basic-example/.npmrc
