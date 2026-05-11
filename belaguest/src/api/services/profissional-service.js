const HttpError = require('./http-error');
const profissionalModel = require('../models/profissional-model');
const userModel = require('../models/user-model');

/**
 * Valida vínculo de usuário ao profissional
 * @async
 * @function validarVinculoUsuario
 * @param {number|null} idUsuario - ID do usuário para vincular
 * @returns {Promise<number|null>} ID do usuário validado ou null
 * @throws {Error} 404 - Usuário não encontrado
 * @throws {Error} 400 - Usuário não é do tipo FUNCIONARIO
 */
async function validarVinculoUsuario(idUsuario) {
  if (!idUsuario) {
    return null;
  }

  const user = await userModel.findUserById(idUsuario);
  if (!user) {
    throw new HttpError('Usuário informado para vínculo não existe.', 404);
  }

  if (user.tipoUsuario !== 'FUNCIONARIO') {
    throw new HttpError('Apenas usuários do tipo FUNCIONARIO podem ser vinculados ao profissional.', 400);
  }

  return idUsuario;
}

/**
 * Cria um novo profissional
 * @async
 * @function create
 * @param {Object} payload - Dados do profissional
 * @param {string} payload.nome - Nome do profissional
 * @param {string} payload.telefone - Telefone do profissional
 * @param {number} [payload.intervaloMinutos=60] - Intervalo entre agendamentos
 * @param {string} [payload.status=ATIVO] - Status do profissional
 * @param {number} [payload.idUsuario] - ID do usuário a vincular
 * @param {Array<number>} [payload.idsServicos] - IDs dos serviços oferecidos
 * @param {Array<Object>} [payload.disponibilidades] - Disponívelidades de horário
 * @returns {Promise<Object>} Profissional criado com detalhe completo
 * @throws {Error} 404 - Usuário não encontrado
 * @throws {Error} 400 - Dados inválidos
 */
  const idUsuario = await validarVinculoUsuario(payload.idUsuario);

  const profissional = await profissionalModel.createProfissional({
    idUsuario,
    nome: payload.nome,
    telefone: payload.telefone,
    intervaloMinutos: payload.intervaloMinutos || 60,
    status: payload.status || 'ATIVO'
  });

  if (Array.isArray(payload.idsServicos)) {
    await profissionalModel.replaceServicosDoProfissional(profissional.id, payload.idsServicos);
  }

  if (Array.isArray(payload.disponibilidades)) {
    await profissionalModel.replaceDisponibilidade(profissional.id, payload.disponibilidades);
  }

  return detail(profissional.id);
}

/**
 * Lista todos os profissionais
 * @async
 * @function list
 * @returns {Promise<Array>} Array de todos os profissionais
 * @throws {Error} Se houver erro na consulta
 */
  return profissionalModel.listProfissionais();
}

/**
 * Retorna detalhes completos de um profissional
 * @async
 * @function detail
 * @param {number} id - ID do profissional
 * @returns {Promise<Object>} Profissional com lista de serviços e disponibilidades
 * @throws {Error} 404 - Profissional não encontrado
 */
  const profissional = await profissionalModel.findProfissionalById(id);
  if (!profissional) {
    throw new HttpError('Profissional não encontrado.', 404);
  }

  const [servicos, disponibilidades] = await Promise.all([
    profissionalModel.listServicosDoProfissional(id),
    profissionalModel.listDisponibilidade(id)
  ]);

  return {
    ...profissional,
    servicos,
    disponibilidades
  };
}

/**
 * Retorna detalhes de um profissional por ID de usuário
 * @async
 * @function detailByUserId
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise<Object>} Profissional com serviços e disponibilidades
 * @throws {Error} 404 - Perfil profissional não encontrado para o usuário
 */
  const profissional = await profissionalModel.findProfissionalByUserId(idUsuario);
  if (!profissional) {
    throw new HttpError('Não há perfil profissional vinculado para este usuário.', 404);
  }

  return detail(profissional.id);
}

/**
 * Atualiza um profissional existente
 * @async
 * @function update
 * @param {number} id - ID do profissional
 * @param {Object} payload - Dados a atualizar
 * @param {string} [payload.nome] - Nome do profissional
 * @param {string} [payload.telefone] - Telefone do profissional
 * @param {number} [payload.intervaloMinutos] - Intervalo entre agendamentos
 * @param {string} [payload.status] - Status do profissional
 * @param {number} [payload.idUsuario] - ID do usuário a vincular
 * @param {Array<number>} [payload.idsServicos] - IDs dos serviços a atualizar
 * @param {Array<Object>} [payload.disponibilidades] - Disponívelidades a atualizar
 * @returns {Promise<Object>} Profissional atualizado
 * @throws {Error} 404 - Profissional não encontrado
 * @throws {Error} 400 - Dados inválidos
 */
  const existing = await profissionalModel.findProfissionalById(id);
  if (!existing) {
    throw new HttpError('Profissional não encontrado.', 404);
  }

  const idUsuario = await validarVinculoUsuario(
    payload.idUsuario !== undefined ? payload.idUsuario : existing.idUsuario
  );

  await profissionalModel.updateProfissional(id, {
    idUsuario,
    nome: payload.nome,
    telefone: payload.telefone,
    intervaloMinutos: payload.intervaloMinutos || existing.intervaloMinutos || 60,
    status: payload.status
  });

  if (Array.isArray(payload.idsServicos)) {
    await profissionalModel.replaceServicosDoProfissional(id, payload.idsServicos);
  }

  if (Array.isArray(payload.disponibilidades)) {
    await profissionalModel.replaceDisponibilidade(id, payload.disponibilidades);
  }

  return detail(id);
}

/**
 * Remove um profissional existente
 * @async
 * @function remove
 * @param {number} id - ID do profissional
 * @returns {Promise<Object>} Mensagem de sucesso
 * @throws {Error} 404 - Profissional não encontrado
 */
  const deleted = await profissionalModel.deleteProfissional(id);
  if (!deleted) {
    throw new HttpError('Profissional não encontrado.', 404);
  }

  return { message: 'Profissional removido com sucesso.' };
}

/**
 * Atualiza a disponibilidade de um profissional pelo seu ID de usuário
 * @async
 * @function updateAvailabilityByUserId
 * @param {number} idUsuario - ID do usuário
 * @param {Object} payload - Dados de disponibilidade
 * @param {number} [payload.intervaloMinutos] - Intervalo entre agendamentos
 * @param {Array<Object>} payload.disponibilidades - Novas disponibilidades
 * @returns {Promise<Object>} Profissional com disponibilidades atualizadas
 * @throws {Error} 404 - Perfil profissional não encontrado
 */
  const profissional = await profissionalModel.findProfissionalByUserId(idUsuario);
  if (!profissional) {
    throw new HttpError('Não há perfil profissional vinculado para este usuário.', 404);
  }

  await profissionalModel.updateProfissional(profissional.id, {
    idUsuario: profissional.idUsuario,
    nome: profissional.nome,
    telefone: profissional.telefone,
    intervaloMinutos: payload.intervaloMinutos || profissional.intervaloMinutos,
    status: profissional.status
  });

  await profissionalModel.replaceDisponibilidade(profissional.id, payload.disponibilidades);

  return detail(profissional.id);
}

/**
 * Atualiza os serviços de um profissional pelo seu ID de usuário
 * @async
 * @function updateServicosByUserId
 * @param {number} idUsuario - ID do usuário
 * @param {Array<number>} idsServicos - IDs dos serviços a atualizar
 * @returns {Promise<Object>} Profissional com serviços atualizados
 * @throws {Error} 404 - Perfil profissional não encontrado
 */
  const profissional = await profissionalModel.findProfissionalByUserId(idUsuario);
  if (!profissional) {
    throw new HttpError('Não há perfil profissional vinculado para este usuário.', 404);
  }

  await profissionalModel.replaceServicosDoProfissional(profissional.id, idsServicos);

  return detail(profissional.id);
}

module.exports = {
  create,
  list,
  detail,
  detailByUserId,
  update,
  updateAvailabilityByUserId,
  updateServicosByUserId,
  remove
};
