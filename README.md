# DIDI-SSI-Server

Main backend of the application, allows you to store the recovery data of
user and acts as an intermediary between the other modules and mouro validating
certificates and preventing unauthorized issuers from issuing certificates.

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 12.22.8

# Environment vars

This project uses the following environment variables:

| Name                          | Default Value | Mandatory |
| ----------------------------- | :-----------: | :-------: |
| DEBUGG_MODE                   |     false     |    ❌     |
| NO_EMAILS                     |     false     |    ❌     |
| NO_SMS                        |     false     |    ❌     |
| ENABLE_INSECURE_ENDPOINTS     |     false     |    ❌     |
| NAME                          |               |     ✔     |
| ENVIRONMENT                   |               |     ✔     |
| RSA_PRIVATE_KEY               |               |     ✔     |
| HASH_SALT                     |               |     ✔     |
| ADDRESS                       |               |     ✔     |
| PORT                          |               |     ✔     |
| MONGO_URL                     |               |     ✔     |
| VERSION                       |               |     ✔     |
| AIDI_VERSION                  |               |     ✔     |
| SERVER_DID                    |               |     ✔     |
| SERVER_PRIVATE_KEY            |               |     ✔     |
| MONGO_URI                     |               |     ✔     |
| MAILGUN_API_KEY               |               |     ✔     |
| MAILGUN_DOMAIN                |               |     ✔     |
| FIREBASE_URL                  |               |     ✔     |
| FIREBASE_PRIV_KEY_PATH        |               |     ✔     |
| TWILIO_SID                    |               |     ✔     |
| TWILIO_TOKEN                  |               |     ✔     |
| TWILIO_PHONE_NUMBER           |               |     ✔     |
| SERVER_IP                     |               |     ✔     |
| RENAPER_SCORE_TRESHOUL        |               |     ✔     |
| RENAPER_API_KEY               |               |     ✔     |
| RENAPER_API                   |               |     ✔     |
| RENAPER_URL                   |               |     ✔     |
| FINGER_PRINT_DATA             |               |     ✔     |
| DISABLE_TELEMETRY_CLIENT      |     false     |    ❌     |
| APP_INSIGTHS_IKEY             |               |     ✔     |
| ENABLE_SEMILLAS               |     false     |    ❌     |
| SEMILLAS_USERNAME             |               |     ✔     |
| SEMILLAS_PASSWORD             |               |     ✔     |
| SEMILLAS_URL                  |               |     ✔     |
| BLOCKCHAIN_URL_RSK            |               |     ✔     |
| BLOCKCHAIN_URL_LAC            |               |     ✔     |
| BLOCKCHAIN_URL_BFA            |               |     ✔     |
| INFURA_KEY                    |               |     ✔     |
| BLOCK_CHAIN_DELEGATE_DURATION |    1300000    |    ❌     |
| GAS_INCREMENT                 |      1.1      |    ❌     |
| INFURA_KEY                    |               |     ✔     |

# Getting started

- Install dependencies

```
npm install
```

- Build and run the project

```
npm run start
```

## Project Structure

```
📦src
 ┣ 📂__tests__
 ┣ 📂.github
 ┣ 📂constants
 ┣ 📂controlles
 ┣ 📂docker-compose
 ┣ 📂jobs
 ┣ 📂middlewares
 ┣ 📂models
 ┣ 📂policies
 ┣ 📂routes
 ┣ 📂services
 ┣ 📂utils
 ┗📜server.js
```

## Project Endpoints

### [Swagger](https://api.issuer.alpha.didi.org.ar/api-docs/)

For more information, see the [documentation](https://docs.didi.org.ar/docs/developers/solucion/descripcion-tecnica/arquitectura-server)
