const agendamentoService = require('../services/agendamento-service');

/**
 * Cria um novo agendamento
 * @async
 * @function create
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.body - Dados do agendamento (dataHora, idServico, idProfissional, etc)
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com agendamento criado (status 201) ou erro
 * @throws {Error} 400 - Dados inválidos ou conflito de agendamento
 * @throws {Error} 401 - Usuário não autenticado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function create(req, res, next) {
  try {
    const result = await agendamentoService.create(req.body, req.user);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Lista agendamentos com filtros opcionais
 * @async
 * @function list
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.query - Parâmetros de filtro (data, status, idProfissional, etc)
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de agendamentos (status 200) ou erro
 * @throws {Error} 400 - Filtros inválidos
 * @throws {Error} 401 - Usuário não autenticado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function list(req, res, next) {
  try {
    const result = await agendamentoService.list(req.query, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Atualiza um agendamento existente
 * @async
 * @function update
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do agendamento
 * @param {Object} req.body - Dados a atualizar
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com agendamento atualizado (status 200) ou erro
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 400 - Dados inválidos ou conflito de agendamento
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function update(req, res, next) {
  try {
    const result = await agendamentoService.update(Number(req.params.id), req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Cancela um agendamento existente
 * @async
 * @function cancel
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do agendamento
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com agendamento cancelado (status 200) ou erro
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 400 - Agendamento já foi cancelado ou não pode ser cancelado
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function cancel(req, res, next) {
  try {
    const result = await agendamentoService.cancel(Number(req.params.id), req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Adiciona uma observação a um agendamento
 * @async
 * @function addObservacao
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.id - ID do agendamento
 * @param {Object} req.body - Corpo da requisição
 * @param {string} req.body.observacao - Texto da observação
 * @param {Object} req.user - Usuário autenticado
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com agendamento atualizado (status 201) ou erro
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 400 - Observação inválida
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function addObservacao(req, res, next) {
  try {
    const result = await agendamentoService.addObservacaoComUsuario(
      Number(req.params.id),
      req.body.observacao,
      req.user
    );
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Retorna sugestões de horários disponíveis para um serviço em uma data
 * @async
 * @function sugestoes
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.query - Parâmetros de consulta
 * @param {string} req.query.data - Data em formato ISO (YYYY-MM-DD)
 * @param {string} req.query.idServico - ID do serviço
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com array de sugestões de horários (status 200) ou erro
 * @throws {Error} 400 - Data ou serviço inválido
 * @throws {Error} 404 - Serviço não encontrado
 * @throws {Error} 500 - Erro interno do servidor
 */
async function sugestoes(req, res, next) {
  try {
    const result = await agendamentoService.sugestoes(req.query.data, Number(req.query.idServico));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Verifica a disponibilidade em um dia específico
 * @async
 * @function disponibilidade
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} req.query - Parâmetros de consulta
 * @param {string} req.query.data - Data em formato ISO (YYYY-MM-DD)
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função middleware de erro
 * @returns {void} Retorna JSON com informações de disponibilidade (status 200) ou erro
 * @throws {Error} 400 - Data inválida
 * @throws {Error} 500 - Erro interno do servidor
 */
async function disponibilidade(req, res, next) {
  try {
    const result = await agendamentoService.disponibilidadeDia(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  update,
  cancel,
  addObservacao,
  sugestoes,
  disponibilidade
};
