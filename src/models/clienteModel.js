const db = require('../config/database');

const clienteModel = {
  async findByUserId(idUsuario) {
    const [rows] = await db.execute(
      `SELECT c.*, u.nome, u.email, u.tipoUsuario
       FROM Cliente c JOIN Usuario u ON c.idUsuario = u.id
       WHERE c.idUsuario = ?`,
      [idUsuario]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT c.*, u.nome, u.email, u.tipoUsuario
       FROM Cliente c JOIN Usuario u ON c.idUsuario = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ idUsuario, telefone }) {
    const [result] = await db.execute(
      'INSERT INTO Cliente (idUsuario, telefone) VALUES (?, ?)',
      [idUsuario, telefone || null]
    );
    return { id: result.insertId, idUsuario, telefone };
  },

  async update(id, { telefone }) {
    const [result] = await db.execute(
      'UPDATE Cliente SET telefone = ? WHERE id = ?',
      [telefone, id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = clienteModel;
