const router = require('express').Router();
const clienteController = require('../controllers/clienteController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/perfil', authenticate, authorize('cliente'), clienteController.getPerfil);
router.put('/perfil', authenticate, authorize('cliente'), clienteController.updatePerfil);
router.get('/historico', authenticate, authorize('cliente'), clienteController.getHistorico);

module.exports = router;
