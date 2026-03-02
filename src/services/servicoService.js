const servicoModel = require('../models/servicoModel');

const servicoService = {
  async getAll() {
    return servicoModel.findAll();
  },

  async getById(id) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new Error('Serviço não encontrado');
    return servico;
  },

  async create({ nome, descricao, duracaoMinutos, preco }) {
    if (!nome) throw new Error('Nome é obrigatório');
    if (preco === undefined || preco === null) throw new Error('Preço é obrigatório');
    return servicoModel.create({ nome, descricao, duracaoMinutos: duracaoMinutos || 60, preco });
  },

  async update(id, data) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new Error('Serviço não encontrado');
    await servicoModel.update(id, data);
    return servicoModel.findById(id);
  },

  async delete(id) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new Error('Serviço não encontrado');
    return servicoModel.delete(id);
  },
};

module.exports = servicoService;
