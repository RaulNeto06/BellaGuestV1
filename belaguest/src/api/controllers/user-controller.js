const userService = require('../services/user-service');

/**
 * Lista todos os usuários administradores
 * @async
 * @function list
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de usuários (status 200) ou erro
 * @throws {Error} 403 - Acesso negado (apenas administradores)
 * @throws {Error} 500 - Erro interno do servidor
 */
async function list(req, res, next) {
  try {
    const result = await userService.listAdminUsers();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza um usuário (administrador)
 * @async
 * @function update
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do usuário
 * @param {Object} req.body - Dados a atualizar
 * @param {Object} req.user - Usuário autenticado (administrador)
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com usuário atualizado (status 200) ou erro
 * @throws {Error} 404 - Usuário não encontrado
 * @throws {Error} 400 - Dados inválidos
 * @throws {Error} 403 - Acesso negado (apenas administradores)
 * @throws {Error} 500 - Erro interno do servidor
 */
async function update(req, res, next) {
  try {
    const result = await userService.updateUserByAdmin(Number(req.params.id), req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  update
};
