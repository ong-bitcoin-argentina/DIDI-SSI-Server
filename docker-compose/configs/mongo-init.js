print('Start #################################################################');

/**
 * Las variables de user, pwd, y db deben coincidir con las variables de entorno del repositorio.
 */

db = db.getSiblingDB('didi-server');
db.createUser(
  {
    user: 'didi-server-user',
    pwd: 'changeMe',
    roles: [{ role: 'readWrite', db: 'didi-server' }],
  },
);
db.createCollection('users');

db = db.getSiblingDB('didi_issuer');
db.createUser(
  {
    user: 'didi-issuer-user',
    pwd: 'changeMe',
    roles: [{ role: 'readWrite', db: 'didi_issuer' }],
  },
);
db.createCollection('users');

print('END #################################################################');