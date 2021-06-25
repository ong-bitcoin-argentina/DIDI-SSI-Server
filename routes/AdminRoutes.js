const router = require('express').Router();
const { validateAdminJWT } = require('../middlewares/ValidateAdminJWT');
const admin = require('../controllers/admin');
const Validator = require('../utils/Validator');

router.use('/admin/', validateAdminJWT);

/**
 * @openapi
 *   /admin/user/did/{did}:
 *   get:
 *     summary: Obtiene información confidencial sobre el usuario según su did.
 *     description: Incluye status de renaper y de semillas.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.get('/admin/user/did/:did',
  Validator.checkValidationResult,
  Validator.validateParams,
  admin.readUserByDid);

/**
 * @openapi
 *   /admin/user/phone:
 *   post:
 *     summary: Obtiene informacion confidencial sobre el usuario según su numero de teléfono.
 *     requestBody:
 *       required:
 *         - phone
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/admin/user/phone',
  Validator.checkValidationResult,
  Validator.validateParams,
  admin.readUserByPhone);

module.exports = router;
