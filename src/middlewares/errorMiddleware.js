function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Registro duplicado' });
  }

  if (err.message.includes('já cadastrado') || err.message.includes('não encontrado') ||
      err.message.includes('inválido') || err.message.includes('obrigatório') ||
      err.message.includes('disponível') || err.message.includes('permissão') ||
      err.message.includes('reservado') || err.message.includes('estado') ||
      err.message.includes('cancelado') || err.message.includes('Status')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Erro interno do servidor' });
}

module.exports = errorMiddleware;
