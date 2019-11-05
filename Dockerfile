FROM node:10-alpine

WORKDIR /usr/src/app
COPY ["package.json","package-lock.json.json","./"]
RUN npm install --no-optional
COPY . .
EXPOSE 3000
EXPOSE 27017

CMD sleep 10 && node server.js