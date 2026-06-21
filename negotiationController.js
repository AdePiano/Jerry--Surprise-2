const Negotiation = require('../models/Negotiation');
const Listing = require('../models/Listing');

// Create negotiation offer
exports.create = async (req, res) => {
  try {
    const { listingId, offeredPrice } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    // Check if negotiation already exists
    const existing = await Negotiation.findOne({
      listing: listingId,
      buyer: req.user._id,
      status: { $in: ['pending', 'countered'] }
    });

    if (existing) {
      return res.status(400).send('You already have a pending negotiation');
    }

    const negotiation = new Negotiation({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      offeredPrice: parseFloat(offeredPrice)
    });

    await negotiation.save();
    res.redirect(`/listings/${listingId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Negotiation failed');
  }
};

// Respond to negotiation (accept/reject/counter)
exports.respond = async (req, res) => {
  try {
    const { negotiationId, action, counterOffer } = req.body;
    
    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
      return res.status(404).send('Negotiation not found');
    }

    // Check if user is the seller
    if (negotiation.seller.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    if (action === 'accept') {
      negotiation.status = 'accepted';
      // Update listing price to negotiated price
      const listing = await Listing.findById(negotiation.listing);
      listing.price = negotiation.offeredPrice;
      await listing.save();
    } else if (action === 'reject') {
      negotiation.status = 'rejected';
    } else if (action === 'counter' && counterOffer) {
      negotiation.status = 'countered';
      negotiation.counterOffer = parseFloat(counterOffer);
    }

    await negotiation.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Response failed');
  }
};
