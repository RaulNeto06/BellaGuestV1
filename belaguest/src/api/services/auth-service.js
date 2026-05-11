const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const HttpError = require('./http-error');
const userModel = require('../models/user-model');
const clienteModel = require('../models/cliente-model');

/**
 * Normaliza um email (trim e lowercase)
 * @function normalizeEmail
 * @param {string} email - Email a normalizar
 * @returns {string} Email normalizado
 */
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Registra um novo usuário do tipo CLIENTE
 * @async
 * @function register
 * @param {Object} params - Parâmetros de registro
 * @param {string} params.nome - Nome completo do usuário
 * @param {string} params.email - Email do usuário
 * @param {string} params.senha - Senha do usuário (mínimo 6 caracteres)
 * @param {string} [params.telefone] - Telefone do usuário
 * @param {string} [params.tipoUsuario] - Tipo de usuário (sempre será CLIENTE)
 * @returns {Promise<Object>} Dados do usuário criado
 * @throws {Error} 403 - Apenas CLIENTEs podem se registrar publicamente
 * @throws {Error} 409 - Email já cadastrado
 */
  const normalizedEmail = normalizeEmail(email);
  const targetRole = tipoUsuario || 'CLIENTE';

  if (targetRole !== 'CLIENTE') {
    throw new HttpError('Cadastro público disponível apenas para clientes.', 403);
  }

  const existing = await userModel.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new HttpError('E-mail já cadastrado.', 409);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const newUser = await userModel.createUser({
    nome: String(nome).trim(),
    email: normalizedEmail,
    senha: senhaHash,
    tipoUsuario: 'CLIENTE'
  });

  await clienteModel.createCliente({ idUsuario: newUser.id, telefone: String(telefone).trim() });

  return newUser;
}

/**
 * Autentica um usuário com email e senha
 * @async
 * @function login
 * @param {Object} credentials - Credenciais de login
 * @param {string} credentials.email - Email do usuário
 * @param {string} credentials.senha - Senha do usuário
 * @returns {Promise<Object>} Token JWT e dados do usuário
 * @throws {Error} 401 - Credenciais inválidas
 */
  const normalizedEmail = normalizeEmail(email);
  const user = await userModel.findUserByEmail(normalizedEmail);
  if (!user) {
    throw new HttpError('Credenciais inválidas.', 401);
  }

  const validPassword = await bcrypt.compare(senha, user.senha);
  if (!validPassword) {
    throw new HttpError('Credenciais inválidas.', 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      tipoUsuario: user.tipoUsuario
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipoUsuario: user.tipoUsuario
    }
  };
}

/**
 * Retorna os dados do usuário autenticado
 * @async
 * @function me
 * @param {number} userId - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 * @throws {Error} 404 - Usuário não encontrado
 */
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new HttpError('Usuário não encontrado.', 404);
  }

  return user;
}

module.exports = {
  register,
  login,
  me
};
