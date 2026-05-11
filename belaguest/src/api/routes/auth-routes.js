const express = require('express');
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const validateRequest = require('../../middlewares/validate-request');
const { registerValidator, loginValidator } = require('../validators/validators');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
