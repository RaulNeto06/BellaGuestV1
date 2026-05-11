const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Não autenticado' });
    if (!roles.includes(req.user.tipoUsuario)) {
      return res.status(403).json({ success: false, message: 'Acesso não autorizado' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
