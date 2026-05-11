const profissionalService = require('../services/profissionalService');
const profissionalModel = require('../models/profissionalModel');
const AppError = require('../utils/AppError');

const profissionalController = {
  async getAll(req, res, next) {
    try {
      const profissionais = await profissionalService.getAll();
      res.json({ success: true, data: profissionais });
    } catch (err) { next(err); }
  },

  // Returns the professional record linked to the currently logged-in employee
  async getMe(req, res, next) {
    try {
      const prof = await profissionalModel.findByUsuario(req.user.id);
      if (!prof) throw new AppError('Nenhum profissional vinculado a este usuário', 404);
      res.json({ success: true, data: prof });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const prof = await profissionalService.getById(req.params.id);
      res.json({ success: true, data: prof });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const prof = await profissionalService.create(req.body);
      res.status(201).json({ success: true, data: prof, message: 'Profissional criado' });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const prof = await profissionalService.update(req.params.id, req.body);
      res.json({ success: true, data: prof, message: 'Profissional atualizado' });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      await profissionalService.delete(req.params.id);
      res.json({ success: true, message: 'Profissional removido' });
    } catch (err) { next(err); }
  },

  async getServicos(req, res, next) {
    try {
      const servicos = await profissionalService.getServicos(req.params.id);
      res.json({ success: true, data: servicos });
    } catch (err) { next(err); }
  },

  async addServico(req, res, next) {
    try {
      await profissionalService.addServico(req.params.id, req.body.idServico);
      res.json({ success: true, message: 'Serviço adicionado ao profissional' });
    } catch (err) { next(err); }
  },

  async removeServico(req, res, next) {
    try {
      await profissionalService.removeServico(req.params.id, req.params.servicoId);
      res.json({ success: true, message: 'Serviço removido do profissional' });
    } catch (err) { next(err); }
  },

  async getHorarios(req, res, next) {
    try {
      const horarios = await profissionalService.getHorarios(req.params.id);
      res.json({ success: true, data: horarios });
    } catch (err) { next(err); }
  },

  async addHorario(req, res, next) {
    try {
      const horario = await profissionalService.addHorario(req.params.id, req.body);
      res.status(201).json({ success: true, data: horario, message: 'Horário adicionado' });
    } catch (err) { next(err); }
  },

  async deleteHorario(req, res, next) {
    try {
      await profissionalService.deleteHorario(req.params.id, req.params.horarioId);
      res.json({ success: true, message: 'Horário removido' });
    } catch (err) { next(err); }
  },

  async replaceHorarios(req, res, next) {
    try {
      const horarios = await profissionalService.replaceHorarios(req.params.id, req.body.horarios);
      res.json({ success: true, data: horarios, message: 'Horários atualizados' });
    } catch (err) { next(err); }
  },
};

module.exports = profissionalController;
