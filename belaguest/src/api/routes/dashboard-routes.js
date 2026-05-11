const express = require('express');
const dashboardController = require('../controllers/dashboard-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const roleMiddleware = require('../../middlewares/role-middleware');

const router = express.Router();

router.get('/resumo', authMiddleware, roleMiddleware(['ADMINISTRADOR']), dashboardController.resumo);

module.exports = router;
