require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve frontend pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/views/index.html')));
app.get('/cliente', (req, res) => res.sendFile(path.join(__dirname, '../public/views/cliente.html')));
app.get('/funcionario', (req, res) => res.sendFile(path.join(__dirname, '../public/views/funcionario.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../public/views/admin.html')));

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 BelaGuest server running on http://localhost:${PORT}`);
});

module.exports = app;
