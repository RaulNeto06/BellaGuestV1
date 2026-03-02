const agendamentoModel = require('../models/agendamentoModel');
const profissionalModel = require('../models/profissionalModel');
const profissionalServicoModel = require('../models/profissionalServicoModel');
const profissionalHorarioModel = require('../models/profissionalHorarioModel');

function generateTimeSlots(startTime, endTime, intervalMinutes = 60) {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let current = sh * 60 + sm;
  const end = eh * 60 + em;
  while (current + intervalMinutes <= end) {
    const h = String(Math.floor(current / 60)).padStart(2, '0');
    const m = String(current % 60).padStart(2, '0');
    slots.push(`${h}:${m}:00`);
    current += intervalMinutes;
  }
  return slots;
}

const agendamentoService = {
  async getDisponibilidade(data, idProfissional = null, idServico = null) {
    const dateObj = new Date(data + 'T00:00:00Z');
    const diaSemana = dateObj.getUTCDay();

    let profissionais = [];
    if (idProfissional) {
      const p = await profissionalModel.findById(idProfissional);
      if (p && p.status === 'ativo') profissionais = [p];
    } else if (idServico) {
      profissionais = await profissionalServicoModel.findByServico(idServico);
    } else {
      profissionais = await profissionalModel.findAll();
      profissionais = profissionais.filter(p => p.status === 'ativo');
    }

    const result = [];
    for (const prof of profissionais) {
      const horarios = await profissionalHorarioModel.findByProfissional(prof.id);
      const todaySchedule = horarios.find(h => h.diaSemana === diaSemana && h.disponivel);
      if (!todaySchedule) continue;

      let servicosDuration = 60;
      if (idServico) {
        const db = require('../config/database');
        const [[serv]] = await db.execute('SELECT duracaoMinutos FROM Servico WHERE id = ?', [idServico]);
        if (serv) servicosDuration = serv.duracaoMinutos;
      }

      const allSlots = generateTimeSlots(
        todaySchedule.horarioInicio.substring(0, 5),
        todaySchedule.horarioFim.substring(0, 5),
        servicosDuration
      );

      const occupied = await agendamentoModel.getOccupiedSlots(data, prof.id);
      const occupiedSet = new Set(occupied.map(h => (typeof h === 'string' ? h : String(h))));

      const services = await profissionalServicoModel.findByProfissional(prof.id);

      result.push({
        profissional: prof,
        servicos: services,
        slots: allSlots.map(slot => ({
          horario: slot,
          disponivel: !occupiedSet.has(slot),
        })),
      });
    }
    return result;
  },

  async create({ data, horario, idCliente, idServico, idProfissional, observacoes }) {
    if (!data || !horario || !idCliente || !idServico) {
      throw new Error('Campos obrigatórios: data, horario, idCliente, idServico');
    }

    // Auto-assign professional if not provided
    let profId = idProfissional;
    if (!profId) {
      const available = await profissionalServicoModel.findByServico(idServico);
      for (const prof of available) {
        const conflict = await agendamentoModel.checkConflict(data, horario, prof.id);
        if (!conflict) {
          profId = prof.id;
          break;
        }
      }
      if (!profId) throw new Error('Nenhum profissional disponível neste horário');
    } else {
      const conflict = await agendamentoModel.checkConflict(data, horario, profId);
      if (conflict) throw new Error('Horário já reservado para este profissional');
    }

    return agendamentoModel.create({ data, horario, idCliente, idServico, idProfissional: profId, observacoes });
  },

  async cancel(id, userId, tipoUsuario) {
    const agendamento = await agendamentoModel.findById(id);
    if (!agendamento) throw new Error('Agendamento não encontrado');

    if (tipoUsuario === 'cliente') {
      const clienteModel = require('../models/clienteModel');
      const cliente = await clienteModel.findByUserId(userId);
      if (!cliente || agendamento.idCliente !== cliente.id) {
        throw new Error('Sem permissão para cancelar este agendamento');
      }
    }

    if (['concluido', 'cancelado'].includes(agendamento.status)) {
      throw new Error('Agendamento não pode ser cancelado neste estado');
    }

    return agendamentoModel.update(id, { status: 'cancelado' });
  },

  async complete(id) {
    const agendamento = await agendamentoModel.findById(id);
    if (!agendamento) throw new Error('Agendamento não encontrado');
    if (agendamento.status === 'cancelado') throw new Error('Agendamento cancelado');
    return agendamentoModel.update(id, { status: 'concluido' });
  },

  async updateStatus(id, status, observacoes) {
    const valid = ['pendente', 'confirmado', 'concluido', 'cancelado'];
    if (!valid.includes(status)) throw new Error('Status inválido');
    return agendamentoModel.update(id, { status, observacoes });
  },

  async listMeus(idCliente) {
    return agendamentoModel.findByCliente(idCliente);
  },

  async listAll(filters) {
    return agendamentoModel.findAll(filters);
  },
};

module.exports = agendamentoService;
