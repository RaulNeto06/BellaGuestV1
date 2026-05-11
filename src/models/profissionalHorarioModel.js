const db = require('../config/database');

const profissionalHorarioModel = {
  async findByProfissional(idProfissional) {
    const [rows] = await db.execute(
      `SELECT * FROM ProfissionalHorario WHERE idProfissional = ? ORDER BY diaSemana, horarioInicio`,
      [idProfissional]
    );
    return rows;
  },

  async create({ idProfissional, diaSemana, horarioInicio, horarioFim, disponivel = true }) {
    const [result] = await db.execute(
      'INSERT INTO ProfissionalHorario (idProfissional, diaSemana, horarioInicio, horarioFim, disponivel) VALUES (?, ?, ?, ?, ?)',
      [idProfissional, diaSemana, horarioInicio, horarioFim, disponivel]
    );
    return { id: result.insertId, idProfissional, diaSemana, horarioInicio, horarioFim, disponivel };
  },

  async update(id, { horarioInicio, horarioFim, disponivel }) {
    const fields = [];
    const values = [];
    if (horarioInicio !== undefined) { fields.push('horarioInicio = ?'); values.push(horarioInicio); }
    if (horarioFim !== undefined) { fields.push('horarioFim = ?'); values.push(horarioFim); }
    if (disponivel !== undefined) { fields.push('disponivel = ?'); values.push(disponivel); }
    if (!fields.length) return null;
    values.push(id);
    const [result] = await db.execute(`UPDATE ProfissionalHorario SET ${fields.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM ProfissionalHorario WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async deleteByProfissionalAndDay(idProfissional, diaSemana) {
    const [result] = await db.execute(
      'DELETE FROM ProfissionalHorario WHERE idProfissional = ? AND diaSemana = ?',
      [idProfissional, diaSemana]
    );
    return result.affectedRows;
  },
};

module.exports = profissionalHorarioModel;
