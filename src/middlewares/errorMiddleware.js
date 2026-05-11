function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Registro duplicado' });
  }

  // Operational errors (business logic) thrown with err.isOperational = true are safe to expose
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Erro interno do servidor' });
}

module.exports = errorMiddleware;
