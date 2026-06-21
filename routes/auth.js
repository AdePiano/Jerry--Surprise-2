const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Show pages
router.get('/register', authController.showRegister);
router.get('/login', authController.showLogin);

// Actions
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Dashboard (protected)
router.get('/dashboard', requireAuth, authController.dashboard);

module.exports = router;
