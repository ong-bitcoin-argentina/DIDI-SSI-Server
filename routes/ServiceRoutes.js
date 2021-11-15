const router = require('express').Router();
const ResponseHandler = require('../utils/ResponseHandler');
const Constants = require('../constants/Constants');

/**
 * @openapi
 * /:
 *   get:
 *     description: Bienvenido a DIDI Server!
 *     responses:
 *       200:
 *         description: Returns a mysterious JSON.
 */
router.get('/', (_, res) => {
  const {
    NAME, ENVIRONMENT, VERSION, AIDI_VERSION,
  } = Constants;

  ResponseHandler.sendRes(res, {
    aidiVersion: AIDI_VERSION,
    environment: ENVIRONMENT,
    name: NAME,
    version: VERSION,
  });
});

/**
 * @openapi
 * /networks:
 *   get:
 *     description: Redes soportadas por DIDI Server y la dirección de ethr-regisrty smart contract
 *     responses:
 *       200:
 *         description: Listado de redes.
 */
router.get('/networks', (_, res) => {
  const { PROVIDER_CONFIG } = Constants;
  const networks = PROVIDER_CONFIG.networks.map(({ name, registry }) => ({
    name, registry,
  }));

  ResponseHandler.sendRes(res, {
    networks,
  });
});

module.exports = router;
