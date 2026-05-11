const agendamentoService = require('../services/agendamentoService');
const agendamentoModel = require('../models/agendamentoModel');
const clienteModel = require('../models/clienteModel');

const agendamentoController = {
  async getDisponibilidade(req, res, next) {
    try {
      const { data, idProfissional, idServico } = req.query;
      if (!data) return res.status(400).json({ success: false, message: 'data é obrigatória (YYYY-MM-DD)' });
      const result = await agendamentoService.getDisponibilidade(data, idProfissional, idServico);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async getMeus(req, res, next) {
    try {
      const cliente = await clienteModel.findByUserId(req.user.id);
      if (!cliente) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
      const agendamentos = await agendamentoService.listMeus(cliente.id);
      res.json({ success: true, data: agendamentos });
    } catch (err) { next(err); }
  },

  async getAll(req, res, next) {
    try {
      const { data, idProfissional, status, startDate, endDate } = req.query;
      const agendamentos = await agendamentoService.listAll({ data, idProfissional, status, startDate, endDate });
      res.json({ success: true, data: agendamentos });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const agendamento = await agendamentoModel.findById(req.params.id);
      if (!agendamento) return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
      res.json({ success: true, data: agendamento });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { data, horario, idServico, idProfissional, observacoes } = req.body;
      const cliente = await clienteModel.findByUserId(req.user.id);
      if (!cliente) return res.status(400).json({ success: false, message: 'Perfil de cliente não encontrado' });
      const agendamento = await agendamentoService.create({
        data, horario, idCliente: cliente.id, idServico, idProfissional, observacoes,
      });
      res.status(201).json({ success: true, data: agendamento, message: 'Agendamento criado com sucesso' });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const { status, observacoes } = req.body;
      const updated = await agendamentoService.updateStatus(req.params.id, status, observacoes);
      res.json({ success: true, data: updated, message: 'Agendamento atualizado' });
    } catch (err) { next(err); }
  },

  async cancel(req, res, next) {
    try {
      await agendamentoService.cancel(req.params.id, req.user.id, req.user.tipoUsuario);
      res.json({ success: true, message: 'Agendamento cancelado' });
    } catch (err) { next(err); }
  },
};

module.exports = agendamentoController;
