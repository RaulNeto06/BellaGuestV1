const db = require('../config/database');

const profissionalServicoModel = {
  async findByProfissional(idProfissional) {
    const [rows] = await db.execute(
      `SELECT s.*, ps.id AS psId FROM Servico s
       JOIN ProfissionalServico ps ON s.id = ps.idServico
       WHERE ps.idProfissional = ?
       ORDER BY s.nome`,
      [idProfissional]
    );
    return rows;
  },

  async addServico(idProfissional, idServico) {
    const [result] = await db.execute(
      'INSERT IGNORE INTO ProfissionalServico (idProfissional, idServico) VALUES (?, ?)',
      [idProfissional, idServico]
    );
    return result.affectedRows > 0;
  },

  async removeServico(idProfissional, idServico) {
    const [result] = await db.execute(
      'DELETE FROM ProfissionalServico WHERE idProfissional = ? AND idServico = ?',
      [idProfissional, idServico]
    );
    return result.affectedRows > 0;
  },

  async findByServico(idServico) {
    const [rows] = await db.execute(
      `SELECT p.* FROM Profissional p
       JOIN ProfissionalServico ps ON p.id = ps.idProfissional
       WHERE ps.idServico = ? AND p.status = 'ativo'`,
      [idServico]
    );
    return rows;
  },
};

module.exports = profissionalServicoModel;
