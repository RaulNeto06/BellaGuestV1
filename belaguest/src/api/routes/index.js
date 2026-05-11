const express = require('express');
const authRoutes = require('./auth-routes');
const servicoRoutes = require('./servico-routes');
const profissionalRoutes = require('./profissional-routes');
const agendamentoRoutes = require('./agendamento-routes');
const dashboardRoutes = require('./dashboard-routes');
const userRoutes = require('./user-routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/usuarios', userRoutes);

module.exports = router;
