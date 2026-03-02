require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// General API rate limit: 200 req / 15 min per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições, tente novamente mais tarde' },
});

// Stricter limit for auth endpoints: 20 req / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas, tente novamente mais tarde' },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes with rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter, routes);

// Serve frontend pages
app.get('/', generalLimiter, (req, res) => res.sendFile(path.join(__dirname, '../public/views/index.html')));
app.get('/cliente', generalLimiter, (req, res) => res.sendFile(path.join(__dirname, '../public/views/cliente.html')));
app.get('/funcionario', generalLimiter, (req, res) => res.sendFile(path.join(__dirname, '../public/views/funcionario.html')));
app.get('/admin', generalLimiter, (req, res) => res.sendFile(path.join(__dirname, '../public/views/admin.html')));

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 BelaGuest server running on http://localhost:${PORT}`);
});

module.exports = app;
