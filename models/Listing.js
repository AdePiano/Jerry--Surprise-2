const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['car-rent', 'car-sell', 'land-sell', 'house-rent', 'house-sell'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['per-day', 'per-month', 'total'],
    default: 'total'
  },
  // Car specific fields
  carDetails: {
    brand: String,
    model: String,
    year: Number,
    seats: Number,
    transmission: String // manual/automatic
  },
  // Land specific fields
  landDetails: {
    size: String, // e.g., "500 sqm"
    titleDeed: String, // yes/no
    zone: String, // e.g., "Kebele 01"
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [String], // Cloudinary URLs
  location: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
