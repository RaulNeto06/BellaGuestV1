const db = require('../config/database');

const servicoModel = {
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM Servico ORDER BY nome');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM Servico WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ nome, descricao, duracaoMinutos = 60, preco }) {
    const [result] = await db.execute(
      'INSERT INTO Servico (nome, descricao, duracaoMinutos, preco) VALUES (?, ?, ?, ?)',
      [nome, descricao || null, duracaoMinutos, preco]
    );
    return { id: result.insertId, nome, descricao, duracaoMinutos, preco };
  },

  async update(id, { nome, descricao, duracaoMinutos, preco }) {
    const fields = [];
    const values = [];
    if (nome !== undefined) { fields.push('nome = ?'); values.push(nome); }
    if (descricao !== undefined) { fields.push('descricao = ?'); values.push(descricao); }
    if (duracaoMinutos !== undefined) { fields.push('duracaoMinutos = ?'); values.push(duracaoMinutos); }
    if (preco !== undefined) { fields.push('preco = ?'); values.push(preco); }
    if (!fields.length) return null;
    values.push(id);
    const [result] = await db.execute(`UPDATE Servico SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM Servico WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = servicoModel;
