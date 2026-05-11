const profissionalService = require('../services/profissional-service');

/**
 * Cria um novo profissional
 * @async
 * @function create
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Dados do profissional (nome, especialidade, disponibilidade, etc)
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com profissional criado (status 201) ou erro
 * @throws {Error} 400 - Dados inválidos ou profissional já existe
 * @throws {Error} 500 - Erro interno do servidor
 */
async function create(req, res, next) {
  try {
    const result = await profissionalService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Lista todos os profissionais
 * @async
 * @function list
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de profissionais (status 200) ou erro
 * @throws {Error} 500 - Erro interno do servidor
 */
async function list(req, res, next) {
  try {
    const result = await profissionalService.list();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retorna detalhes de um profissional por ID
 * @async
 * @function detail
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do profissional
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com dados do profissional (status 200) ou erro
 * @throws {Error} 404 - Profissional não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function detail(req, res, next) {
  try {
    const result = await profissionalService.detail(Number(req.params.id));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retorna o perfil profissional do usuário autenticado
 * @async
 * @function me
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com perfil do profissional (status 200) ou erro
 * @throws {Error} 404 - Perfil profissional não encontrado para o usuário
 * @throws {Error} 500 - Erro interno do servidor
 */
async function me(req, res, next) {
  try {
    const result = await profissionalService.detailByUserId(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza um profissional existente
 * @async
 * @function update
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do profissional
 * @param {Object} req.body - Dados a atualizar
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com profissional atualizado (status 200) ou erro
 * @throws {Error} 404 - Profissional não encontrado
 * @throws {Error} 400 - Dados inválidos
 * @throws {Error} 500 - Erro interno do servidor
 */
async function update(req, res, next) {
  try {
    const result = await profissionalService.update(Number(req.params.id), req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza a disponibilidade do profissional autenticado
 * @async
 * @function updateMyAvailability
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Dados de disponibilidade (dias, horários, etc)
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com disponibilidade atualizada (status 200) ou erro
 * @throws {Error} 404 - Perfil profissional não encontrado
 * @throws {Error} 400 - Dados de disponibilidade inválidos
 * @throws {Error} 500 - Erro interno do servidor
 */
async function updateMyAvailability(req, res, next) {
  try {
    const result = await profissionalService.updateAvailabilityByUserId(req.user.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Remove um profissional existente
 * @async
 * @function remove
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do profissional
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com resultado da remoção (status 200) ou erro
 * @throws {Error} 404 - Profissional não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function remove(req, res, next) {
  try {
    const result = await profissionalService.remove(Number(req.params.id));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza os serviços do profissional autenticado
 * @async
 * @function updateMyServices
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Corpo da requisição
 * @param {Array<number>} req.body.idsServicos - Array de IDs de serviços
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com serviços atualizados (status 200) ou erro
 * @throws {Error} 404 - Perfil profissional não encontrado
 * @throws {Error} 400 - IDs de serviços inválidos
 * @throws {Error} 500 - Erro interno do servidor
 */
async function updateMyServices(req, res, next) {
  try {
    const result = await profissionalService.updateServicosByUserId(req.user.id, req.body.idsServicos);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retorna os serviços do profissional autenticado
 * @async
 * @function getMyServices
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de serviços (status 200) ou erro
 * @throws {Error} 404 - Perfil profissional não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function getMyServices(req, res, next) {
  try {
    const profissional = await profissionalService.detailByUserId(req.user.id);
    return res.status(200).json(profissional.servicos);
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  create,
  list,
  detail,
  me,
  update,
  updateMyAvailability,
  updateMyServices,
  getMyServices,
  remove
};
