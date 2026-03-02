const db = require('../config/database');
const profissionalModel = require('../models/profissionalModel');
const profissionalServicoModel = require('../models/profissionalServicoModel');
const profissionalHorarioModel = require('../models/profissionalHorarioModel');

const profissionalService = {
  async getAll() {
    const profissionais = await profissionalModel.findAll();
    return profissionais;
  },

  async getById(id) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new Error('Profissional não encontrado');
    const servicos = await profissionalServicoModel.findByProfissional(id);
    const horarios = await profissionalHorarioModel.findByProfissional(id);
    return { ...prof, servicos, horarios };
  },

  async create(data) {
    if (!data.nome) throw new Error('Nome é obrigatório');
    return profissionalModel.create(data);
  },

  async update(id, data) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new Error('Profissional não encontrado');
    await profissionalModel.update(id, data);
    return profissionalModel.findById(id);
  },

  async delete(id) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new Error('Profissional não encontrado');
    return profissionalModel.delete(id);
  },

  async addServico(idProfissional, idServico) {
    const prof = await profissionalModel.findById(idProfissional);
    if (!prof) throw new Error('Profissional não encontrado');
    return profissionalServicoModel.addServico(idProfissional, idServico);
  },

  async removeServico(idProfissional, idServico) {
    return profissionalServicoModel.removeServico(idProfissional, idServico);
  },

  async getServicos(idProfissional) {
    return profissionalServicoModel.findByProfissional(idProfissional);
  },

  async getHorarios(idProfissional) {
    return profissionalHorarioModel.findByProfissional(idProfissional);
  },

  async addHorario(idProfissional, horario) {
    const prof = await profissionalModel.findById(idProfissional);
    if (!prof) throw new Error('Profissional não encontrado');
    return profissionalHorarioModel.create({ idProfissional, ...horario });
  },

  async deleteHorario(idProfissional, horarioId) {
    return profissionalHorarioModel.delete(horarioId);
  },

  async replaceHorarios(idProfissional, horarios) {
    await db.execute('DELETE FROM ProfissionalHorario WHERE idProfissional = ?', [idProfissional]);
    const created = [];
    for (const h of horarios) {
      const r = await profissionalHorarioModel.create({ idProfissional, ...h });
      created.push(r);
    }
    return created;
  },
};

module.exports = profissionalService;
