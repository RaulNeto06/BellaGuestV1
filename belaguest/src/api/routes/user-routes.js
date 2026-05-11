const express = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const roleMiddleware = require('../../middlewares/role-middleware');
const validateRequest = require('../../middlewares/validate-request');
const { idParamValidator, usuarioUpdateValidator } = require('../validators/validators');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), userController.list);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMINISTRADOR']),
  idParamValidator,
  usuarioUpdateValidator,
  validateRequest,
  userController.update
);

module.exports = router;
