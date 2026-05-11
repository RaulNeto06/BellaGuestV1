const db = require('../config/database');
const profissionalModel = require('../models/profissionalModel');
const profissionalServicoModel = require('../models/profissionalServicoModel');
const profissionalHorarioModel = require('../models/profissionalHorarioModel');
const AppError = require('../utils/AppError');

const profissionalService = {
  async getAll() {
    const profissionais = await profissionalModel.findAll();
    return profissionais;
  },

  async getById(id) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new AppError('Profissional não encontrado', 404);
    const servicos = await profissionalServicoModel.findByProfissional(id);
    const horarios = await profissionalHorarioModel.findByProfissional(id);
    return { ...prof, servicos, horarios };
  },

  async create(data) {
    if (!data.nome) throw new AppError('Nome é obrigatório');
    return profissionalModel.create(data);
  },

  async update(id, data) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new AppError('Profissional não encontrado', 404);
    await profissionalModel.update(id, data);
    return profissionalModel.findById(id);
  },

  async delete(id) {
    const prof = await profissionalModel.findById(id);
    if (!prof) throw new AppError('Profissional não encontrado', 404);
    return profissionalModel.delete(id);
  },

  async addServico(idProfissional, idServico) {
    const prof = await profissionalModel.findById(idProfissional);
    if (!prof) throw new AppError('Profissional não encontrado', 404);
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
    if (!prof) throw new AppError('Profissional não encontrado', 404);
    return profissionalHorarioModel.create({ idProfissional, ...horario });
  },

  async deleteHorario(idProfissional, horarioId) {
    return profissionalHorarioModel.delete(horarioId);
  },

  async replaceHorarios(idProfissional, horarios) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute('DELETE FROM ProfissionalHorario WHERE idProfissional = ?', [idProfissional]);
      const created = [];
      for (const h of horarios) {
        const [result] = await conn.execute(
          'INSERT INTO ProfissionalHorario (idProfissional, diaSemana, horarioInicio, horarioFim, disponivel) VALUES (?, ?, ?, ?, ?)',
          [idProfissional, h.diaSemana, h.horarioInicio, h.horarioFim, h.disponivel !== false]
        );
        created.push({ id: result.insertId, idProfissional, ...h });
      }
      await conn.commit();
      return created;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = profissionalService;
