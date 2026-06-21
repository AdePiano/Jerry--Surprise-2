const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const axios = require('axios');

// Create booking
exports.create = async (req, res) => {
  try {
    const { listingId, startDate, endDate, paymentMethod } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    // Calculate total (for car rental - per day)
    let totalAmount = listing.price;
    if (listing.priceUnit === 'per-day') {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      totalAmount = listing.price * days;
    }

    const booking = new Booking({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount,
      paymentMethod
    });

    await booking.save();

    // If payment method is Telebirr or CBE, initiate payment
    if (paymentMethod === 'telebirr' || paymentMethod === 'cbe') {
      // Here you integrate with Telebirr/CBE API
      // For now, redirect to payment page
      return res.render('bookings/payment', {
        title: 'Payment',
        booking,
        user: req.user
      });
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Booking failed');
  }
};

// Confirm payment (webhook or callback)
exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, transactionId, status } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    if (status === 'success') {
      booking.paymentStatus = 'paid';
      booking.transactionId = transactionId;
      booking.status = 'confirmed';
      await booking.save();

      // Mark listing as unavailable if it's a land sale
      const listing = await Listing.findById(booking.listing);
      if (listing.category === 'land-sell' || listing.category === 'house-sell') {
        listing.isAvailable = false;
        await listing.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
};
