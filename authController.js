const User = require('../models/User');

// Show register page
exports.showRegister = (req, res) => {
  res.render('register', { title: 'Register', error: null });
};

// Show login page
exports.showLogin = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { 
        title: 'Register', 
        error: 'Email already registered' 
      });
    }

    // Create user
    const user = new User({
      fullName,
      email,
      phone,
      password,
      role: role || 'buyer'
    });

    await user.save();

    // Log user in
    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('register', { 
      title: 'Register', 
      error: 'Registration failed. Please try again.' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid email or password' 
      });
    }

    // Set session
    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('login', { 
      title: 'Login', 
      error: 'Login failed. Please try again.' 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const Listing = require('../models/Listing');
    const Booking = require('../models/Booking');
    
    const listings = await Listing.find({ seller: req.user._id });
    const bookings = await Booking.find({ 
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    }).populate('listing');

    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      listings,
      bookings
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};
