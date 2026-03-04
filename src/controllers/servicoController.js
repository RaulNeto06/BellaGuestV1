const servicoService = require('../services/servicoService');

const servicoController = {
  async getAll(req, res, next) {
    try {
      const servicos = await servicoService.getAll();
      res.json({ success: true, data: servicos });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const servico = await servicoService.getById(req.params.id);
      res.json({ success: true, data: servico });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const servico = await servicoService.create(req.body);
      res.status(201).json({ success: true, data: servico, message: 'Serviço criado' });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const servico = await servicoService.update(req.params.id, req.body);
      res.json({ success: true, data: servico, message: 'Serviço atualizado' });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      await servicoService.delete(req.params.id);
      res.json({ success: true, message: 'Serviço removido' });
    } catch (err) { next(err); }
  },
};

module.exports = servicoController;
