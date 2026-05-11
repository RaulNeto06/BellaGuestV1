const servicoService = require('../services/servico-service');

/**
 * Cria um novo serviço
 * @async
 * @function create
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Dados do serviço (nome, descrição, duração, preço, etc)
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com serviço criado (status 201) ou erro
 * @throws {Error} 400 - Dados inválidos ou serviço já existe
 * @throws {Error} 500 - Erro interno do servidor
 */
async function create(req, res, next) {
  try {
    const result = await servicoService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Lista todos os serviços
 * @async
 * @function list
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de serviços (status 200) ou erro
 * @throws {Error} 500 - Erro interno do servidor
 */
async function list(req, res, next) {
  try {
    const result = await servicoService.list();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza um serviço existente
 * @async
 * @function update
 * @param {Object} req - Objeto de requisião Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do serviço
 * @param {Object} req.body - Dados a atualizar
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com serviço atualizado (status 200) ou erro
 * @throws {Error} 404 - Serviço não encontrado
 * @throws {Error} 400 - Dados inválidos
 * @throws {Error} 500 - Erro interno do servidor
 */
async function update(req, res, next) {
  try {
    const result = await servicoService.update(Number(req.params.id), req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Remove um serviço existente
 * @async
 * @function remove
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do serviço
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com resultado da remoção (status 200) ou erro
 * @throws {Error} 404 - Serviço não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function remove(req, res, next) {
  try {
    const result = await servicoService.remove(Number(req.params.id));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  update,
  remove
};
