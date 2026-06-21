const express = require('express');
const router = express.Router();
const negotiationController = require('../controllers/negotiationController');
const { requireAuth } = require('../middleware/auth');

router.post('/create', requireAuth, negotiationController.create);
router.post('/respond', requireAuth, negotiationController.respond);

module.exports = router;
