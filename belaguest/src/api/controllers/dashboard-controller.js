const dashboardService = require('../services/dashboard-service');

/**
 * Retorna um resumo dos dados do dashboard
 * @async
 * @function resumo
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.query - Parâmetros de filtro (dataInicio, dataFim, etc)
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com resumo do dashboard (status 200) ou erro
 * @throws {Error} 400 - Filtros inválidos ou datas inválidas
 * @throws {Error} 500 - Erro interno do servidor
 */
async function resumo(req, res, next) {
  try {
    const result = await dashboardService.resumo(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  resumo
};
