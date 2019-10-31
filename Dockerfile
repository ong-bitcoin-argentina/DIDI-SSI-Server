FROM node:10-alpine

WORKDIR /usr/src/app
COPY ["package.json","./"]
RUN npm install --no-optional
COPY . .
EXPOSE 3000

CMD sleep 10 && MONGO_DIR="mongo" node server.js