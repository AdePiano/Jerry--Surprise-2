const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');
const { requireAuth, isAdmin } = require('../middleware/auth');

// Admin dashboard
router.get('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const pendingListings = await Listing.find({ isApproved: false })
      .populate('seller', 'fullName email');
    const allUsers = await User.find();
    const allListings = await Listing.find();

    res.render('admin/pending', {
      title: 'Admin Dashboard',
      user: req.user,
      pendingListings,
      allUsers: allUsers.length,
      allListings: allListings.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Approve listing
router.post('/approve/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    listing.isApproved = true;
    await listing.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to approve');
  }
});

// Reject listing
router.post('/reject/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to reject');
  }
});

module.exports = router;
