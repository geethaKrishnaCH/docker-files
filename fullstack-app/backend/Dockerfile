FROM node:16.19-alpine3.16

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV MONGO_USERNAME=beehyv

ENV MONGO_PASSWORD=beehyv123

EXPOSE 8080

CMD [ "npm", "start" ]