FROM node:15-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Update and install some node dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache --virtual .gyp \
        bash \
        git \
        openssh \
        python \
        make \
        g++ \
        && npm ci \
        && apk del .gyp

# Bundle app source
COPY . .

EXPOSE 8089
CMD [ "node", "server.js" ]