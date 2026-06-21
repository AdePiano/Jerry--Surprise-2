const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.post('/create', requireAuth, bookingController.create);
router.post('/confirm-payment', bookingController.confirmPayment);

module.exports = router;
