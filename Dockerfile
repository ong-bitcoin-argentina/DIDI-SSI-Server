FROM node:10-alpine

RUN apk --no-cache add --virtual native-deps \
	g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
	npm install --quiet node-gyp -g

WORKDIR /usr/src/app
COPY ["package.json","./"]
RUN npm install --no-optional
COPY . .
EXPOSE 3000

CMD sleep 10 && MONGO_DIR="mongo" node server.js