const db = require('../config/database');

const usuarioModel = {
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM Usuario WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT id, nome, email, tipoUsuario, criadoEm FROM Usuario WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ nome, email, senha, tipoUsuario = 'cliente' }) {
    const [result] = await db.execute(
      'INSERT INTO Usuario (nome, email, senha, tipoUsuario) VALUES (?, ?, ?, ?)',
      [nome, email, senha, tipoUsuario]
    );
    return { id: result.insertId, nome, email, tipoUsuario };
  },

  async update(id, { nome, email }) {
    const fields = [];
    const values = [];
    if (nome) { fields.push('nome = ?'); values.push(nome); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (!fields.length) return null;
    values.push(id);
    const [result] = await db.execute(`UPDATE Usuario SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async updateSenha(id, senha) {
    const [result] = await db.execute('UPDATE Usuario SET senha = ? WHERE id = ?', [senha, id]);
    return result.affectedRows > 0;
  },
};

module.exports = usuarioModel;
