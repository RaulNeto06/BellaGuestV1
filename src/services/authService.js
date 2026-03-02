const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const clienteModel = require('../models/clienteModel');

const JWT_SECRET = process.env.JWT_SECRET || 'belaguest_secret';
const JWT_EXPIRES = '7d';

const authService = {
  async register({ nome, email, senha, telefone }) {
    const existing = await usuarioModel.findByEmail(email);
    if (existing) throw new Error('E-mail já cadastrado');

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
    if (!usuario) throw new Error('Credenciais inválidas');

    const valid = await bcrypt.compare(senha, usuario.senha);
    if (!valid) throw new Error('Credenciais inválidas');

    const payload = { id: usuario.id, tipoUsuario: usuario.tipoUsuario };

    if (usuario.tipoUsuario === 'cliente') {
      const cliente = await clienteModel.findByUserId(usuario.id);
      if (cliente) payload.idCliente = cliente.id;
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
