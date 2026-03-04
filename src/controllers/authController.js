const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const { nome, email, senha, telefone } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ success: false, message: 'nome, email e senha são obrigatórios' });
      }
      const result = await authService.register({ nome, email, senha, telefone });
      res.status(201).json({ success: true, data: result, message: 'Cadastro realizado com sucesso' });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'email e senha são obrigatórios' });
      }
      const result = await authService.login({ email, senha });
      res.json({ success: true, data: result, message: 'Login realizado com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
