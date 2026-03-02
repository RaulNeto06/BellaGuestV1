const router = require('express').Router();
const profissionalController = require('../controllers/profissionalController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', profissionalController.getAll);
router.get('/:id', profissionalController.getById);
router.post('/', authenticate, authorize('administrador'), profissionalController.create);
router.put('/:id', authenticate, authorize('administrador'), profissionalController.update);
router.delete('/:id', authenticate, authorize('administrador'), profissionalController.delete);

router.get('/:id/servicos', profissionalController.getServicos);
router.post('/:id/servicos', authenticate, authorize('funcionario', 'administrador'), profissionalController.addServico);
router.delete('/:id/servicos/:servicoId', authenticate, authorize('funcionario', 'administrador'), profissionalController.removeServico);

router.get('/:id/horarios', profissionalController.getHorarios);
router.post('/:id/horarios', authenticate, authorize('funcionario', 'administrador'), profissionalController.addHorario);
router.put('/:id/horarios', authenticate, authorize('funcionario', 'administrador'), profissionalController.replaceHorarios);
router.delete('/:id/horarios/:horarioId', authenticate, authorize('funcionario', 'administrador'), profissionalController.deleteHorario);

module.exports = router;
