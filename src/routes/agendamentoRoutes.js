const router = require('express').Router();
const agendamentoController = require('../controllers/agendamentoController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/disponibilidade', agendamentoController.getDisponibilidade);
router.get('/meus', authenticate, authorize('cliente'), agendamentoController.getMeus);
router.get('/', authenticate, authorize('funcionario', 'administrador'), agendamentoController.getAll);
router.get('/:id', authenticate, agendamentoController.getById);
router.post('/', authenticate, authorize('cliente'), agendamentoController.create);
router.put('/:id', authenticate, authorize('funcionario', 'administrador'), agendamentoController.update);
router.delete('/:id', authenticate, agendamentoController.cancel);

module.exports = router;
