FROM node:12.8-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/bot-scripts
COPY package.json package-lock.json ./

RUN npm install

COPY . .
