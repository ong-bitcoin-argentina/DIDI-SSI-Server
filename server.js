require('dotenv-flow').config({ silent: true });
require('./services/logger');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Constants = require('./constants/Constants');
const Messages = require('./constants/Messages');

const IssuerRoutes = require('./routes/IssuerRoutes');
const UserRoutes = require('./routes/UserRoutes');
const SmsRoutes = require('./routes/SmsRoutes');
const MailRoutes = require('./routes/MailRoutes');
const RenaperRoutes = require('./routes/RenaperRoutes');
const SemillasRoutes = require('./routes/SemillasRoutes');
const AppUserAuthRoutes = require('./routes/AppUserAuthRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const PresentationRoutes = require('./routes/PresentationRoutes');
const ShareRequestRoutes = require('./routes/ShareRequestRoutes');
const { permanentJob } = require('./jobs/jobs');
const {
  NAME, VERSION, ENVIRONMENT,
} = require('./constants/Constants');
// inicializar cluster para workers, uno por cpu disponible

const app = express();
const server = http.createServer(app);

// sobreescribir log para agregarle el timestamp
const { log } = console;
// eslint-disable-next-line no-console
console.log = (data) => {
  process.stdout.write(`${new Date().toISOString()}: `);
  log(data);
};

// aumentar el tamaño de request permitido (fix renaper...)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

// eslint-disable-next-line no-console
if (Constants.DEBUGG) console.log(Messages.INDEX.MSG.CONNECTING + Constants.MONGO_URL);

// configuracion de mongoose
mongoose
  .connect(Constants.MONGO_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  // eslint-disable-next-line no-console
  .then(() => console.log(Messages.INDEX.MSG.CONNECTED))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(Messages.INDEX.ERR.CONNECTION + err.message);
  });

/**
 * Config de Swagger
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: NAME,
      description: `Corriendo en el ambiente: ${ENVIRONMENT}. Para más información, visite la [documentación](https://docs.didi.org.ar/).`,
      version: VERSION,
    },
    servers: [{
      url: '/api/1.0/didi',
    }],
  },
  apis: ['./*.js', './routes/*.js'], // files containing annotations as above
};
const apiSpecification = swaggerJsdoc(options);
/**
 * @openapi
 * /api-docs:
 *   get:
 *     description: Welcome to the jungle!
 *     responses:
 *       200:
 *         description: Returns a mysterious webpage.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpecification));

/**
 * @openapi
 * /:
 *   get:
 *     description: Bienvenido a DIDI Server!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', (_, res) => res.send(`${Messages.INDEX.MSG.HELLO_WORLD} v${VERSION}`));

app.use(bodyParser.json());

// loggear llamadas
app.use((req, _, next) => {
  if (Constants.DEBUGG) {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl}`);
    process.stdout.write('body: ');
    // eslint-disable-next-line no-console
    console.log(req.body);
  }
  next();
});

// loggear errores
app.use((error, req, _, next) => {
  // eslint-disable-next-line no-console
  console.log(error);
  next();
});

const route = `/api/${Constants.API_VERSION}/didi`;
if (Constants.DEBUGG) {
  // eslint-disable-next-line no-console
  console.log(`route: ${route}`);
}

app.use(
  multer({
    dest: './uploads/',
    rename: function rename(_fieldname, filename) {
      return filename;
    },
  }).single('file'),
);

app.use(route, IssuerRoutes);
app.use(route, UserRoutes);
app.use(route, SmsRoutes);
app.use(route, MailRoutes);
app.use(route, RenaperRoutes);
app.use(route, SemillasRoutes);
app.use(route, AppUserAuthRoutes);
app.use(route, AdminRoutes);
app.use(route, PresentationRoutes);
app.use(route, ShareRequestRoutes);
app.use('*', (req, res) => res.status(404).json({
  status: 'error',
  errorCode: 'INVALID_ROUTE',
  message: 'Route does not exist',
}));

// forkear workers
if (cluster.isMaster) {
  // eslint-disable-next-line no-console
  console.log(Messages.INDEX.MSG.STARTING_WORKERS(numCPUs));
  permanentJob();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    // eslint-disable-next-line no-console
    console.log(Messages.INDEX.MSG.STARTED_WORKER(worker.process.pid));
  });

  cluster.on('exit', (worker, code, signal) => {
    // eslint-disable-next-line no-console
    console.log(Messages.INDEX.MSG.ENDED_WORKER(worker.process.pid, code, signal));
    // eslint-disable-next-line no-console
    console.log(Messages.INDEX.MSG.STARTING_WORKER);
    cluster.fork();
  });
} else {
  server.listen(Constants.PORT);
  // eslint-disable-next-line no-console
  console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
}
