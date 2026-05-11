const authService = require('../services/auth-service');

/**
 * Registra um novo usuário do tipo cliente
 * @async
 * @function register
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Dados de registro
 * @param {string} req.body.nome - Nome completo do usuário
 * @param {string} req.body.email - Email do usuário
 * @param {string} req.body.senha - Senha do usuário
 * @param {string} [req.body.telefone] - Telefone do usuário
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com dados do usuário (status 201) ou erro
 * @throws {Error} 400 - Dados inválidos
 * @throws {Error} 409 - Email já cadastrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Autentica um usuário (login)
 * @async
 * @function login
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Credenciais de login
 * @param {string} req.body.email - Email do usuário
 * @param {string} req.body.senha - Senha do usuário
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com token e dados do usuário (status 200) ou erro
 * @throws {Error} 401 - Credenciais inválidas
 * @throws {Error} 400 - Campos obrigatórios faltando
 * @throws {Error} 500 - Erro interno do servidor
 */
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retorna os dados do usuário autenticado
 * @async
 * @function me
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.user - Payload JWT do middleware de autenticação
 * @param {number} req.user.id - ID do usuário
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com dados do usuário (status 200) ou erro
 * @throws {Error} 401 - Não autenticado
 * @throws {Error} 404 - Usuário não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function me(req, res, next) {
  try {
    const result = await authService.me(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me
};
