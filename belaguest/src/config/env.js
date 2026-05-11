const dotenv = require('dotenv');

dotenv.config();

const required = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'PORT',
  'JWT_SECRET'
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
});

/**
 * Validação de PORT como número
 */
const port = Number(process.env.PORT);
if (Number.isNaN(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um número entre 1 e 65535');
}

/**
 * Validação de JWT_SECRET
 */
if (process.env.JWT_SECRET.length < 16) {
  console.warn('AVISO: JWT_SECRET tem menos de 16 caracteres. Recomenda-se uma chave mais forte em produção.');
}

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  PORT: port,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
