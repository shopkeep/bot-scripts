FROM node:10.7-alpine

ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json package-lock.json .npmrc /aperture-science/
WORKDIR /aperture-science/
RUN npm install

COPY . /aperture-science/

RUN rm -f /aperture-science/.npmrc
