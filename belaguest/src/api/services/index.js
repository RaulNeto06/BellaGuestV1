// Exporta todos os serviços
module.exports = {
  agendamentoService: require('./agendamento-service'),
  authService: require('./auth-service'),
  dashboardService: require('./dashboard-service'),
  httpError: require('./http-error'),
  profissionalService: require('./profissional-service'),
  servicoService: require('./servico-service'),
  userService: require('./user-service')
};
