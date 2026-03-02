const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/agendamentos', require('./agendamentoRoutes'));
router.use('/profissionais', require('./profissionalRoutes'));
router.use('/servicos', require('./servicoRoutes'));
router.use('/clientes', require('./clienteRoutes'));

module.exports = router;
