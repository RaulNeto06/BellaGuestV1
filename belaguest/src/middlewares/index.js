// Exporta todos os middlewares
module.exports = {
  authMiddleware: require('./auth-middleware'),
  errorHandler: require('./error-handler'),
  roleMiddleware: require('./role-middleware'),
  validateRequest: require('./validate-request')
};
