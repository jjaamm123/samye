
const mongoose = require('mongoose');

const ItineraryPhaseSchema = new mongoose.Schema(
  {
    day:         { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const AdventureSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    sportType:    { type: String, required: true },   
    location:     { type: String, required: true },
    duration:     { type: String, required: true },  
    intensity:    { type: String, enum: ['Easy', 'Moderate', 'Intense', 'Extreme'], default: 'Moderate' },
    price:        { type: Number, required: true },
    minAge:       { type: String, default: '16+' },
    description:  { type: String, required: true },
    featuredImage:{ type: String, default: '/images/default.jpg' },
    gallery:      [{ type: String }],
    safetyNotes:  { type: String, default: '' },

    included: [{ type: String, trim: true }],
    excluded: [{ type: String, trim: true }],

    itinerary: [ItineraryPhaseSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Adventure', AdventureSchema);