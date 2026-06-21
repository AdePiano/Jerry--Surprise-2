const Listing = require('../models/Listing');

// Show create listing form
exports.showCreate = (req, res) => {
  res.render('listings/create', { 
    title: 'Create Listing',
    error: null,
    user: req.user
  });
};

// Create new listing
exports.create = async (req, res) => {
  try {
    const { 
      category, title, description, price, priceUnit, 
      location, carBrand, carModel, carYear, carSeats, 
      transmission, landSize, titleDeed, zone 
    } = req.body;

    // Build listing object
    const listingData = {
      seller: req.user._id,
      category,
      title,
      description,
      price: parseFloat(price),
      priceUnit: priceUnit || 'total',
      location,
      images: req.files ? req.files.map(file => file.path) : []
    };

    // Add car details if category is car
    if (category === 'car-rent' || category === 'car-sell') {
      listingData.carDetails = {
        brand: carBrand,
        model: carModel,
        year: parseInt(carYear),
        seats: parseInt(carSeats),
        transmission
      };
    }

    // Add land details if category is land-sell
    if (category === 'land-sell') {
      listingData.landDetails = {
        size: landSize,
        titleDeed: titleDeed === 'yes',
        zone
      };
    }

    const listing = new Listing(listingData);
    await listing.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('listings/create', {
      title: 'Create Listing',
      error: 'Failed to create listing. Please try again.',
      user: req.user
    });
  }
};

// Get all listings (with filters)
exports.getAll = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    
    let filter = { isApproved: true, isAvailable: true };
    
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    const listings = await Listing.find(filter)
      .populate('seller', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.render('listings/list', {
      title: 'All Listings',
      listings,
      user: req.user || null,
      filters: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Get single listing
exports.getOne = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'fullName phone email');

    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    res.render('listings/detail', {
      title: listing.title,
      listing,
      user: req.user || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Delete listing
exports.delete = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    // Check ownership
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Unauthorized');
    }

    await listing.remove();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
