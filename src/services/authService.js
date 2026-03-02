const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const clienteModel = require('../models/clienteModel');
const profissionalModel = require('../models/profissionalModel');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/auth');

const authService = {
  async register({ nome, email, senha, telefone }) {
    const existing = await usuarioModel.findByEmail(email);
    if (existing) throw new AppError('E-mail já cadastrado');

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await usuarioModel.create({ nome, email, senha: hash, tipoUsuario: 'cliente' });
    const cliente = await clienteModel.create({ idUsuario: usuario.id, telefone });

    const token = jwt.sign(
      { id: usuario.id, tipoUsuario: 'cliente', idCliente: cliente.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return { token, usuario: { id: usuario.id, nome, email, tipoUsuario: 'cliente' } };
  },

  async login({ email, senha }) {
    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) throw new AppError('Credenciais inválidas', 401);

    const valid = await bcrypt.compare(senha, usuario.senha);
    if (!valid) throw new AppError('Credenciais inválidas', 401);

    const payload = { id: usuario.id, tipoUsuario: usuario.tipoUsuario };

    if (usuario.tipoUsuario === 'cliente') {
      const cliente = await clienteModel.findByUserId(usuario.id);
      if (cliente) payload.idCliente = cliente.id;
    } else if (usuario.tipoUsuario === 'funcionario') {
      // Include the linked professional ID so the employee dashboard can use it
      const profissional = await profissionalModel.findByUsuario(usuario.id);
      if (profissional) payload.idProfissional = profissional.id;
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipoUsuario: usuario.tipoUsuario },
    };
  },

  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  },
};

module.exports = authService;
