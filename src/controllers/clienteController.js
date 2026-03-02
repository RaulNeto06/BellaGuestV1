const clienteService = require('../services/clienteService');

const clienteController = {
  async getPerfil(req, res, next) {
    try {
      const perfil = await clienteService.getPerfil(req.user.id);
      res.json({ success: true, data: perfil });
    } catch (err) { next(err); }
  },

  async updatePerfil(req, res, next) {
    try {
      const { nome, telefone } = req.body;
      const perfil = await clienteService.updatePerfil(req.user.id, { nome, telefone });
      res.json({ success: true, data: perfil, message: 'Perfil atualizado' });
    } catch (err) { next(err); }
  },

  async getHistorico(req, res, next) {
    try {
      const historico = await clienteService.getHistorico(req.user.id);
      res.json({ success: true, data: historico });
    } catch (err) { next(err); }
  },
};

module.exports = clienteController;
