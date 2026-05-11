const agendamentoModel = require('../models/agendamento-model');

/**
 * Retorna um resumo dos agendamentos com indicadores
 * @async
 * @function resumo
 * @param {Object} params - Parâmetros de filtro
 * @param {string} [params.data] - Data em formato YYYY-MM-DD (opcional)
 * @param {number} [params.idProfissional] - ID do profissional (opcional)
 * @returns {Promise<Object>} Resumo com indicadores e lista de agendamentos
 * @throws {Error} Se houver erro na consulta
 */
async function resumo({ data, idProfissional }) {
  const agendamentos = await agendamentoModel.listAgendamentos({ data, idProfissional });

  const total = agendamentos.length;
  const confirmados = agendamentos.filter((a) => a.status === 'CONFIRMADO').length;
  const concluidos = agendamentos.filter((a) => a.status === 'CONCLUIDO').length;
  const cancelados = agendamentos.filter((a) => a.status === 'CANCELADO').length;

  return {
    filtros: { data: data || null, idProfissional: idProfissional || null },
    indicadores: {
      total,
      confirmados,
      concluidos,
      cancelados,
      taxaCancelamento: total ? Number(((cancelados / total) * 100).toFixed(2)) : 0
    },
    agendamentos
  };
}

module.exports = {
  resumo
};
