const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { requireAuth, isSeller } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Public routes
router.get('/', listingController.getAll);
router.get('/:id', listingController.getOne);

// Protected routes
router.get('/create', requireAuth, isSeller, listingController.showCreate);
router.post('/create', requireAuth, isSeller, uploadImages, listingController.create);
router.post('/:id/delete', requireAuth, listingController.delete);

module.exports = router;
