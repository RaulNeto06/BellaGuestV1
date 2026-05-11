const express = require('express');
const servicoController = require('../controllers/servico-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const roleMiddleware = require('../../middlewares/role-middleware');
const validateRequest = require('../../middlewares/validate-request');
const { servicoValidator, idParamValidator } = require('../validators/validators');

const router = express.Router();

router.get('/', authMiddleware, servicoController.list);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMINISTRADOR']),
  servicoValidator,
  validateRequest,
  servicoController.create
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMINISTRADOR']),
  idParamValidator,
  servicoValidator,
  validateRequest,
  servicoController.update
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMINISTRADOR']),
  idParamValidator,
  validateRequest,
  servicoController.remove
);

module.exports = router;
