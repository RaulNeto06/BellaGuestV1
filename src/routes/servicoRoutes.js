const router = require('express').Router();
const servicoController = require('../controllers/servicoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', servicoController.getAll);
router.get('/:id', servicoController.getById);
router.post('/', authenticate, authorize('administrador'), servicoController.create);
router.put('/:id', authenticate, authorize('administrador'), servicoController.update);
router.delete('/:id', authenticate, authorize('administrador'), servicoController.delete);

module.exports = router;
