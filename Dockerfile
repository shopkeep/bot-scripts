FROM node:11-alpine

ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json package-lock.json /bot-scripts/
WORKDIR /bot-scripts/
RUN npm install

COPY . /bot-scripts/
