FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --only=prod

COPY src ./src
COPY version ./version

CMD [ "node", "src/app.js" ]
