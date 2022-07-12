FROM node:16

RUN mkdir /usr/src/app/upload
RUN mkdir /usr/src/app/upload/pdf
RUN mkdir /usr/src/app/upload/img
RUN mkdir /usr/src/app/upload/video

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
