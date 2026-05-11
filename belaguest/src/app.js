const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { testConnection } = require('./config/database');
const routes = require('./api/routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

// Security: CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Request size limiting
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static files
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: env.NODE_ENV === 'production' ? '1h' : 0,
  etag: false
}));

// Rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login, tente novamente em 15 minutos.',
  standardHeaders: false,
  legacyHeaders: false
});

app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

app.use('/api/v1', routes);

app.get('/health', async (_, res) => {
  const databaseOk = await testConnection();

  return res.status(databaseOk ? 200 : 500).json({
    status: databaseOk ? 'ok' : 'degraded',
    service: 'BelaGuest API',
    database: databaseOk ? 'connected' : 'disconnected'
  });
});

app.use(errorHandler);

module.exports = app;
