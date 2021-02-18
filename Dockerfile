FROM node:15.8.0-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm ci --production && npm cache clear --force

COPY lib/ ./lib/

CMD ["node", "lib/index.js"]
