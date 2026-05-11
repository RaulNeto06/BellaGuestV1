const agendamentoModel = require('../models/agendamento-model');
const clienteModel = require('../models/cliente-model');
const profissionalModel = require('../models/profissional-model');
const servicoModel = require('../models/servico-model');
const HttpError = require('./http-error');
const { getIO } = require('../../config/socket');

/**
 * Converte string de tempo (HH:MM) para minutos
 * @function timeToMinutes
 * @param {string|number} value - Tempo em formato HH:MM ou HH:MM:SS
 * @returns {number} Total de minutos desde meia-noite
 */
function timeToMinutes(value) {
  const [hour, minute] = String(value).split(':').map(Number);
  return (hour * 60) + minute;
}

/**
 * Converte minutos para string de tempo (HH:MM:SS)
 * @function minutesToTime
 * @param {number} value - Total de minutos desde meia-noite
 * @returns {string} Tempo em formato HH:MM:SS
 */
  const hours = String(Math.floor(value / 60)).padStart(2, '0');
  const minutes = String(value % 60).padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

/**
 * Constrói slots de horários disponíveis a partir de disponibilidades
 * @function buildSlotsFromDisponibilidade
 * @param {Array} disponibilidades - Array de disponívelidades com horários
 * @param {number} dayOfWeek - Dia da semana (0-6)
 * @param {number} intervaloMinutos - Intervalo entre slots
 * @returns {Array<string>} Array de horários disponíveis ordenados
 */
  const slots = [];
  const seen = new Set();

  for (const slot of disponibilidades) {
    if (slot.diaSemana !== dayOfWeek) {
      continue;
    }

    const startMinutes = timeToMinutes(slot.horarioInicio);
    const endMinutes = timeToMinutes(slot.horarioFim);

    for (let current = startMinutes; current + intervaloMinutos <= endMinutes; current += intervaloMinutos) {
      const horario = minutesToTime(current);
      if (!seen.has(horario)) {
        seen.add(horario);
        slots.push(horario);
      }
    }
  }

  return slots.sort();
}

/**
 * Obtém o dia da semana a partir de string de data
 * @function getDayFromDate
 * @param {string} dateString - Data em formato YYYY-MM-DD
 * @returns {number} Dia da semana (0 = domingo, 6 = sábado)
 */
  const day = new Date(`${dateString}T00:00:00`).getDay();
  return day;
}

/**
 * Valida se um tempo está entre um intervalo
 * @function isBetweenTime
 * @param {string} target - Horário alvo (HH:MM:SS)
 * @param {string} start - Horário de início (HH:MM:SS)
 * @param {string} end - Horário de fim (HH:MM:SS)
 * @returns {boolean} Verdadeiro se target está entre start e end
 */
  return target >= start && target < end;
}

/**
 * Valida disponibuidade de um profissional para um horário específíco
 * @async
 * @function validarDisponibilidadeProfissional
 * @param {number} idProfissional - ID do profissional
 * @param {string} data - Data em formato YYYY-MM-DD
 * @param {string} horario - Horário em formato HH:MM ou HH:MM:SS
 * @returns {Promise<boolean>} Verdadeiro se disponível
 * @throws {Error} Se houver erro na consulta
 */
  const profissional = await profissionalModel.findProfissionalById(idProfissional);
  const disponibilidade = await profissionalModel.listDisponibilidade(idProfissional);
  if (!disponibilidade.length) {
    return false;
  }

  const day = getDayFromDate(data);
  const slots = buildSlotsFromDisponibilidade(disponibilidade, day, Number(profissional?.intervaloMinutos) || 60);
  return slots.includes(String(horario).length === 5 ? `${horario}:00` : horario);
}

/**
 * Escolhe um profissional disponível para agendamento
 * @async
 * @function escolherProfissionalDisponivel
 * @param {Object} params - Parâmetros
 * @param {string} params.data - Data em formato YYYY-MM-DD
 * @param {string} params.horario - Horário em formato HH:MM:SS
 * @param {number} params.idServico - ID do serviço
 * @returns {Promise<Object|null>} Profissional disponível ou null
 * @throws {Error} Se houver erro na consulta
 */
  const candidatos = await profissionalModel.listProfissionaisDisponiveis({ data, horario, idServico });

  for (const profissional of candidatos) {
    const isDisponivel = await validarDisponibilidadeProfissional(profissional.id, data, horario);
    if (isDisponivel) {
      return profissional;
    }
  }

  return null;
}

/**
 * Resolve o ID do cliente a partir do usuário autenticado
 * @async
 * @function resolverClienteId
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<number>} ID do cliente
 * @throws {Error} 403 - Se usuário não for cliente
 * @throws {Error} 404 - Se cliente não for encontrado
 */
  if (user.tipoUsuario !== 'CLIENTE') {
    throw new HttpError('Apenas clientes podem criar reservas diretas.', 403);
  }

  const cliente = await clienteModel.findClienteByUserId(user.id);
  if (!cliente) {
    throw new HttpError('Perfil de cliente não encontrado.', 404);
  }

  return cliente.id;
}

/**
 * Resolve o ID do profissional a partir do usuário autenticado
 * @async
 * @function resolverProfissionalId
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<number>} ID do profissional
 * @throws {Error} 403 - Se usuário não for funcionário
 * @throws {Error} 404 - Se profissional não for vinculado
 */
  if (user.tipoUsuario !== 'FUNCIONARIO') {
    throw new HttpError('Apenas funcionários podem usar este fluxo.', 403);
  }

  const profissional = await profissionalModel.findProfissionalByUserId(user.id);
  if (!profissional) {
    throw new HttpError('Funcionário sem vínculo com profissional.', 404);
  }

  return profissional.id;
}

/**
 * Cria um novo agendamento
 * @async
 * @function create
 * @param {Object} payload - Dados do agendamento
 * @param {string} payload.data - Data em formato YYYY-MM-DD
 * @param {string} payload.horario - Horário em formato HH:MM:SS
 * @param {number} payload.idServico - ID do serviço
 * @param {number} [payload.idProfissional] - ID do profissional (opcional, "ANY" para auto-seleção)
 * @param {Object} user - Usuário autenticado (deve ser CLIENTE)
 * @returns {Promise<Object>} Agendamento criado
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 404 - Recurso não encontrado
 * @throws {Error} 409 - Conflito de agendamento
 * @throws {Error} 400 - Dados inválidos
 */
  const idCliente = await resolverClienteId(user);

  const servico = await servicoModel.findServicoById(payload.idServico);
  if (!servico) {
    throw new HttpError('Serviço não encontrado.', 404);
  }

  let idProfissional = payload.idProfissional;

  if (!idProfissional || String(idProfissional).toUpperCase() === 'ANY') {
    const profissional = await escolherProfissionalDisponivel({
      data: payload.data,
      horario: payload.horario,
      idServico: payload.idServico
    });

    if (!profissional) {
      throw new HttpError('Nenhum profissional disponível para este horário.', 409);
    }

    idProfissional = profissional.id;
  }

  const profissional = await profissionalModel.findProfissionalById(idProfissional);
  if (!profissional || profissional.status !== 'ATIVO') {
    throw new HttpError('Profissional inválido ou inativo.', 400);
  }

  const ofereceServico = (await profissionalModel.listServicosDoProfissional(idProfissional))
    .some((item) => item.id === payload.idServico);

  if (!ofereceServico) {
    throw new HttpError('Este profissional não oferece o serviço selecionado.', 400);
  }

  const disponivelNoHorario = await validarDisponibilidadeProfissional(idProfissional, payload.data, payload.horario);
  if (!disponivelNoHorario) {
    throw new HttpError('Profissional indisponível neste horário.', 409);
  }

  const hasConflito = await agendamentoModel.existsConflitoProfissional({
    data: payload.data,
    horario: payload.horario,
    idProfissional
  });

  if (hasConflito) {
    throw new HttpError('Já existe agendamento para este profissional no horário selecionado.', 409);
  }

  const agendamento = await agendamentoModel.createAgendamento({
    data: payload.data,
    horario: payload.horario,
    status: 'CONFIRMADO',
    idCliente,
    idServico: payload.idServico,
    idProfissional
  });

  getIO().emit('agendamento:created', agendamento);

  return agendamento;
}

/**
 * Lista agendamentos com filtros
 * @async
 * @function list
 * @param {Object} filters - Filtros de busca (data, status, idCliente, idProfissional, etc)
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<Array>} Array de agendamentos
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 404 - Perfil não encontrado
 */
  const normalized = { ...filters };

  if (user.tipoUsuario === 'CLIENTE') {
    normalized.idCliente = await resolverClienteId(user);
  }

  if (user.tipoUsuario === 'FUNCIONARIO') {
    normalized.idProfissional = await resolverProfissionalId(user);
  }

  return agendamentoModel.listAgendamentos(normalized);
}

/**
 * Atualiza um agendamento existente
 * @async
 * @function update
 * @param {number} id - ID do agendamento
 * @param {Object} payload - Dados a atualizar
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<Object>} Agendamento atualizado
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 403 - Acesso negado
 * @throws {Error} 409 - Conflito de horário
 */
  const existing = await agendamentoModel.findAgendamentoById(id);
  if (!existing) {
    throw new HttpError('Agendamento não encontrado.', 404);
  }

  if (user.tipoUsuario === 'CLIENTE') {
    const idCliente = await resolverClienteId(user);
    if (existing.idCliente !== idCliente) {
      throw new HttpError('Você não pode editar este agendamento.', 403);
    }
  }

  if (user.tipoUsuario === 'FUNCIONARIO') {
    const idProfissional = await resolverProfissionalId(user);
    if (existing.idProfissional !== idProfissional) {
      throw new HttpError('Você não pode editar agendamentos de outro profissional.', 403);
    }

    if (payload.idProfissional !== idProfissional) {
      throw new HttpError('Funcionário não pode alterar o profissional do agendamento.', 403);
    }
  }

  const hasConflito = await agendamentoModel.existsConflitoProfissional({
    data: payload.data,
    horario: payload.horario,
    idProfissional: payload.idProfissional,
    ignoreId: id
  });

  if (hasConflito) {
    throw new HttpError('Conflito de horário com outro agendamento.', 409);
  }

  const updated = await agendamentoModel.updateAgendamento(id, payload);
  getIO().emit('agendamento:updated', updated);
  return updated;
}

/**
 * Cancela um agendamento
 * @async
 * @function cancel
 * @param {number} id - ID do agendamento
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<Object>} Agendamento cancelado
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 403 - Acesso negado
 */
  const existing = await agendamentoModel.findAgendamentoById(id);
  if (!existing) {
    throw new HttpError('Agendamento não encontrado.', 404);
  }

  if (user.tipoUsuario === 'CLIENTE') {
    const idCliente = await resolverClienteId(user);
    if (existing.idCliente !== idCliente) {
      throw new HttpError('Você não pode cancelar este agendamento.', 403);
    }
  }

  if (user.tipoUsuario === 'FUNCIONARIO') {
    const idProfissional = await resolverProfissionalId(user);
    if (existing.idProfissional !== idProfissional) {
      throw new HttpError('Você não pode cancelar agendamentos de outro profissional.', 403);
    }
  }

  const updated = await agendamentoModel.updateAgendamento(id, {
    data: existing.data,
    horario: existing.horario,
    status: 'CANCELADO',
    idServico: existing.idServico,
    idProfissional: existing.idProfissional
  });

  getIO().emit('agendamento:cancelled', updated);
  return updated;
}

/**
 * Adiciona uma observação a um agendamento
 * @async
 * @function addObservacao
 * @param {number} id - ID do agendamento
 * @param {string} observacao - Texto da observação
 * @returns {Promise<Object>} Observação adicionada
 * @throws {Error} 404 - Agendamento não encontrado
 */
  const existing = await agendamentoModel.findAgendamentoById(id);
  if (!existing) {
    throw new HttpError('Agendamento não encontrado.', 404);
  }

  return agendamentoModel.addObservacao({ idAgendamento: id, observacao });
}

/**
 * Adiciona observação com validação de usuário
 * @async
 * @function addObservacaoComUsuario
 * @param {number} id - ID do agendamento
 * @param {string} observacao - Texto da observação
 * @param {Object} user - Usuário autenticado
 * @returns {Promise<Object>} Observação adicionada
 * @throws {Error} 404 - Agendamento não encontrado
 * @throws {Error} 403 - Acesso negado
 */
  const existing = await agendamentoModel.findAgendamentoById(id);
  if (!existing) {
    throw new HttpError('Agendamento não encontrado.', 404);
  }

  if (user.tipoUsuario === 'FUNCIONARIO') {
    const idProfissional = await resolverProfissionalId(user);
    if (existing.idProfissional !== idProfissional) {
      throw new HttpError('Você não pode comentar agendamentos de outro profissional.', 403);
    }
  }

  return agendamentoModel.addObservacao({ idAgendamento: id, observacao });
}

/**
 * Retorna sugestões de horários disponíveis para uma data e serviço
 * @async
 * @function sugestoes
 * @param {string} data - Data em formato YYYY-MM-DD
 * @param {number} idServico - ID do serviço
 * @returns {Promise<Object>} Sugestões com horários e profissionais
 * @throws {Error} Se houver erro na consulta
 */
  const profissionais = (await profissionalModel.listProfissionais()).filter((item) => item.status === 'ATIVO');
  const sugestoesDisponiveis = [];

  const diaSemana = getDayFromDate(data);
  const candidateSet = new Set();

  for (const profissional of profissionais) {
    const disponibilidades = await profissionalModel.listDisponibilidade(profissional.id);
    const slots = buildSlotsFromDisponibilidade(
      disponibilidades,
      diaSemana,
      Number(profissional.intervaloMinutos) || 60
    );

    slots.forEach((slot) => candidateSet.add(slot));
  }

  const horariosOrdenados = Array.from(candidateSet).sort();

  for (const horario of horariosOrdenados) {
    const disponivel = await escolherProfissionalDisponivel({ data, horario, idServico });
    if (disponivel) {
      sugestoesDisponiveis.push({
        horario,
        profissional: {
          id: disponivel.id,
          nome: disponivel.nome
        }
      });
    }
  }

  return {
    data,
    totalProfissionais: profissionais.length,
    sugestoes: sugestoesDisponiveis
  };
}

/**
 * Retorna disponibilidade de profissionais para um dia específíco
 * @async
 * @function disponibilidadeDia
 * @param {Object} params - Parâmetros
 * @param {string} params.data - Data em formato YYYY-MM-DD (obrigatório)
 * @param {number} [params.idServico] - ID do serviço (opcional)
 * @param {number} [params.idProfissional] - ID do profissional (opcional)
 * @returns {Promise<Object>} Disponibilidade por profissional com slots de horários
 * @throws {Error} 400 - Data obrigatória não fornecida
 */
  if (!data) {
    throw new HttpError('A data é obrigatória para consulta de disponibilidade.', 400);
  }

  const allProfissionais = await profissionalModel.listProfissionais();
  let profissionais = allProfissionais.filter((item) => item.status === 'ATIVO');

  if (idProfissional) {
    profissionais = profissionais.filter((item) => item.id === Number(idProfissional));
  }

  const agendamentosDia = await agendamentoModel.listAgendamentos({ data });
  const agendaPorProfissional = [];

  for (const profissional of profissionais) {
    const servicosDoProfissional = await profissionalModel.listServicosDoProfissional(profissional.id);
    const disponibilidades = await profissionalModel.listDisponibilidade(profissional.id);

    if (idServico && !servicosDoProfissional.some((item) => item.id === Number(idServico))) {
      continue;
    }

    const diaSemana = getDayFromDate(data);
    const horariosDia = buildSlotsFromDisponibilidade(
      disponibilidades,
      diaSemana,
      Number(profissional.intervaloMinutos) || 60
    );

    const slots = horariosDia.map((horario) => {

      const reserva = agendamentosDia.find(
        (ag) => ag.idProfissional === profissional.id && ag.horario === horario && ag.status !== 'CANCELADO'
      );

      return {
        horario,
        status: reserva ? 'OCUPADO' : 'LIVRE',
        servicos: servicosDoProfissional,
        agendamento: reserva || null
      };
    });

    agendaPorProfissional.push({
      profissional,
      slots
    });
  }

  return {
    data,
    filtros: {
      idServico: idServico ? Number(idServico) : null,
      idProfissional: idProfissional ? Number(idProfissional) : null
    },
    agenda: agendaPorProfissional
  };
}

module.exports = {
  create,
  list,
  update,
  cancel,
  addObservacao,
  addObservacaoComUsuario,
  sugestoes,
  disponibilidadeDia
};
