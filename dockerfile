FROM node:16-alpine

WORKDIR /mnt/app
COPY . .

RUN npm install
