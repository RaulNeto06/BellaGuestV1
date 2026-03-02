const db = require('../config/database');

const profissionalModel = {
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM Profissional ORDER BY nome');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM Profissional WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ nome, especialidade, telefone, status = 'ativo' }) {
    const [result] = await db.execute(
      'INSERT INTO Profissional (nome, especialidade, telefone, status) VALUES (?, ?, ?, ?)',
      [nome, especialidade || null, telefone || null, status]
    );
    return { id: result.insertId, nome, especialidade, telefone, status };
  },

  async update(id, { nome, especialidade, telefone, status }) {
    const fields = [];
    const values = [];
    if (nome !== undefined) { fields.push('nome = ?'); values.push(nome); }
    if (especialidade !== undefined) { fields.push('especialidade = ?'); values.push(especialidade); }
    if (telefone !== undefined) { fields.push('telefone = ?'); values.push(telefone); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (!fields.length) return null;
    values.push(id);
    const [result] = await db.execute(`UPDATE Profissional SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM Profissional WHERE id = ?', [id]);
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

module.exports = profissionalModel;
