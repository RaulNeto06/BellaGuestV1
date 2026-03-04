const servicoModel = require('../models/servicoModel');
const AppError = require('../utils/AppError');

const servicoService = {
  async getAll() {
    return servicoModel.findAll();
  },

  async getById(id) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404);
    return servico;
  },

  async create({ nome, descricao, duracaoMinutos, preco }) {
    if (!nome) throw new AppError('Nome é obrigatório');
    if (preco === undefined || preco === null) throw new AppError('Preço é obrigatório');
    return servicoModel.create({ nome, descricao, duracaoMinutos: duracaoMinutos || 60, preco });
  },

  async update(id, data) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404);
    await servicoModel.update(id, data);
    return servicoModel.findById(id);
  },

  async delete(id) {
    const servico = await servicoModel.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404);
    return servicoModel.delete(id);
  },
};

module.exports = servicoService;
