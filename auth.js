const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require login
exports.requireAuth = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth/login');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.redirect('/auth/login');
  }
};

// Check if user is seller
exports.isSeller = (req, res, next) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).send('Access denied. Seller only.');
  }
  next();
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied. Admin only.');
  }
  next();
};
