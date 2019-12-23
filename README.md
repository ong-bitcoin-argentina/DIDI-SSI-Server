# didi-server

## Variables de entorno

## importante:

## - al correr en docker estas constantes se toman del archibo '.env',

## - al correr de forma local, los que no se pasen por paràmetro se tomaràn del archibo de constantes (constants/Constants.js)

MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
MONGO_DB
MONGO_USERNAME
MONGO_PASSWORD

MONGO_DIR
SERVER_DID
SERVER_PRIVATE_KEY

MOURO_URL

CREDENTIALS_CONTEXT

MAILGUN_API_KEY
MAILGUN_DOMAIN

TWILIO_SID
TWILIO_TOKEN
TWILIO_PHONE_NUMBER
PHONE_REGION

DEBUGG_MODE
PORT

## Ejecutar local usando valores por defecto (es necesario tener mongo instalado)

```
mongod
npm install
npm start
```

## Ejecutar docker con instancia de mongo incluida

```
docker-compose up --build
```
