const HttpError = require('./http-error');
const servicoModel = require('../models/servico-model');

/**
 * Cria um novo serviço
 * @async
 * @function create
 * @param {Object} payload - Dados do serviço (nome, descrição, duração, preço, etc)
 * @returns {Promise<Object>} Serviço criado
 * @throws {Error} 400 - Dados inválidos
 */
async function create(payload) {
  return servicoModel.createServico(payload);
}

/**
 * Lista todos os serviços
 * @async
 * @function list
 * @returns {Promise<Array>} Array de todos os serviços
 * @throws {Error} Se houver erro na consulta
 */
  return servicoModel.listServicos();
}

/**
 * Atualiza um serviço existente
 * @async
 * @function update
 * @param {number} id - ID do serviço
 * @param {Object} payload - Dados a atualizar
 * @returns {Promise<Object>} Serviço atualizado
 * @throws {Error} 404 - Serviço não encontrado
 * @throws {Error} 400 - Dados inválidos
 */
  const existing = await servicoModel.findServicoById(id);
  if (!existing) {
    throw new HttpError('Serviço não encontrado.', 404);
  }

  return servicoModel.updateServico(id, payload);
}

/**
 * Remove um serviço existente
 * @async
 * @function remove
 * @param {number} id - ID do serviço
 * @returns {Promise<Object>} Mensagem de sucesso
 * @throws {Error} 404 - Serviço não encontrado
 */
  const deleted = await servicoModel.deleteServico(id);
  if (!deleted) {
    throw new HttpError('Serviço não encontrado.', 404);
  }

  return { message: 'Serviço removido com sucesso.' };
}

module.exports = {
  create,
  list,
  update,
  remove
};
