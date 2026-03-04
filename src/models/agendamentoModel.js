const db = require('../config/database');

const agendamentoModel = {
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT a.*, u.nome AS nomeCliente, s.nome AS nomeServico, p.nome AS nomeProfissional
       FROM Agendamento a
       JOIN Cliente c ON a.idCliente = c.id
       JOIN Usuario u ON c.idUsuario = u.id
       JOIN Servico s ON a.idServico = s.id
       JOIN Profissional p ON a.idProfissional = p.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByCliente(idCliente, status = null) {
    let sql = `SELECT a.*, s.nome AS nomeServico, s.preco, p.nome AS nomeProfissional
               FROM Agendamento a
               JOIN Servico s ON a.idServico = s.id
               JOIN Profissional p ON a.idProfissional = p.id
               WHERE a.idCliente = ?`;
    const params = [idCliente];
    if (status) { sql += ' AND a.status = ?'; params.push(status); }
    sql += ' ORDER BY a.data DESC, a.horario DESC';
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  async findByProfissional(idProfissional, data = null) {
    let sql = `SELECT a.*, u.nome AS nomeCliente, s.nome AS nomeServico, s.duracaoMinutos
               FROM Agendamento a
               JOIN Cliente c ON a.idCliente = c.id
               JOIN Usuario u ON c.idUsuario = u.id
               JOIN Servico s ON a.idServico = s.id
               WHERE a.idProfissional = ?`;
    const params = [idProfissional];
    if (data) { sql += ' AND a.data = ?'; params.push(data); }
    sql += ' ORDER BY a.data ASC, a.horario ASC';
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  async findByDate(data) {
    const [rows] = await db.execute(
      `SELECT a.*, u.nome AS nomeCliente, s.nome AS nomeServico, p.nome AS nomeProfissional
       FROM Agendamento a
       JOIN Cliente c ON a.idCliente = c.id
       JOIN Usuario u ON c.idUsuario = u.id
       JOIN Servico s ON a.idServico = s.id
       JOIN Profissional p ON a.idProfissional = p.id
       WHERE a.data = ?
       ORDER BY a.horario ASC, p.nome ASC`,
      [data]
    );
    return rows;
  },

  async findAll({ data, idProfissional, status, startDate, endDate } = {}) {
    let sql = `SELECT a.*, u.nome AS nomeCliente, s.nome AS nomeServico, p.nome AS nomeProfissional
               FROM Agendamento a
               JOIN Cliente c ON a.idCliente = c.id
               JOIN Usuario u ON c.idUsuario = u.id
               JOIN Servico s ON a.idServico = s.id
               JOIN Profissional p ON a.idProfissional = p.id
               WHERE 1=1`;
    const params = [];
    if (data) { sql += ' AND a.data = ?'; params.push(data); }
    if (idProfissional) { sql += ' AND a.idProfissional = ?'; params.push(idProfissional); }
    if (status) { sql += ' AND a.status = ?'; params.push(status); }
    if (startDate) { sql += ' AND a.data >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND a.data <= ?'; params.push(endDate); }
    sql += ' ORDER BY a.data DESC, a.horario DESC';
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  async create({ data, horario, idCliente, idServico, idProfissional, observacoes }) {
    const [result] = await db.execute(
      'INSERT INTO Agendamento (data, horario, idCliente, idServico, idProfissional, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
      [data, horario, idCliente, idServico, idProfissional, observacoes || null]
    );
    return { id: result.insertId, data, horario, idCliente, idServico, idProfissional, status: 'pendente' };
  },

  async update(id, { status, observacoes }) {
    const fields = [];
    const values = [];
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (observacoes !== undefined) { fields.push('observacoes = ?'); values.push(observacoes); }
    if (!fields.length) return null;
    values.push(id);
    const [result] = await db.execute(`UPDATE Agendamento SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM Agendamento WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async checkConflict(data, horario, idProfissional, excludeId = null) {
    let sql = 'SELECT id FROM Agendamento WHERE data = ? AND horario = ? AND idProfissional = ? AND status != ?';
    const params = [data, horario, idProfissional, 'cancelado'];
    if (excludeId) { sql += ' AND id != ?'; params.push(excludeId); }
    const [rows] = await db.execute(sql, params);
    return rows.length > 0;
  },

  async getOccupiedSlots(data, idProfissional) {
    const [rows] = await db.execute(
      `SELECT horario FROM Agendamento
       WHERE data = ? AND idProfissional = ? AND status != 'cancelado'`,
      [data, idProfissional]
    );
    return rows.map(r => r.horario);
  },

  async countByStatus(data) {
    const [rows] = await db.execute(
      `SELECT status, COUNT(*) AS total FROM Agendamento WHERE data = ? GROUP BY status`,
      [data]
    );
    return rows;
  },
};

module.exports = agendamentoModel;
