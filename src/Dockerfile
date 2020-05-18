FROM node:12-alpine3.11

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json package.json
RUN npm i && mv node_modules /node_modules
RUN ls

COPY . /app
RUN ls /app

LABEL maintainer="Matt Rusczyk <mrusczyk@gmail.com>"

CMD ["node",  "bot.js"]