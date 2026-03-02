const clienteModel = require('../models/clienteModel');
const usuarioModel = require('../models/usuarioModel');
const agendamentoModel = require('../models/agendamentoModel');

const clienteService = {
  async getPerfil(idUsuario) {
    const cliente = await clienteModel.findByUserId(idUsuario);
    if (!cliente) throw new Error('Perfil não encontrado');
    return cliente;
  },

  async updatePerfil(idUsuario, { nome, telefone }) {
    const cliente = await clienteModel.findByUserId(idUsuario);
    if (!cliente) throw new Error('Perfil não encontrado');
    if (nome) await usuarioModel.update(idUsuario, { nome });
    if (telefone !== undefined) await clienteModel.update(cliente.id, { telefone });
    return clienteModel.findByUserId(idUsuario);
  },

  async getHistorico(idUsuario) {
    const cliente = await clienteModel.findByUserId(idUsuario);
    if (!cliente) throw new Error('Cliente não encontrado');
    return agendamentoModel.findByCliente(cliente.id);
  },
};

module.exports = clienteService;
