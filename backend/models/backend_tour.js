const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema(
  {
    day:         { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

// PRICING SCHEMA
/**
 * @desc displayType controls frontend rendering format:
 * 'exact'         -> "$1,200"
 * 'starting_from' -> "Starting from $1,200"
 * 'por'           -> "Price on Request" (amount ignored)
 */
const PriceSchema = new mongoose.Schema(
  {
    amount:      { type: Number, required: true, default: 0 },
    displayType: {
      type:    String,
      enum:    ['exact', 'starting_from', 'por'],
      default: 'starting_from'
    }
  },
  { _id: false }
);

const TourSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    destination: { type: String, required: true, enum: ['Nepal', 'Tibet', 'India'] },
    
    // TAXONOMY
    experienceTheme: { 
      type: String, 
      enum: ['Adventure & Active', 'Nature & Discovery', 'Culture & Lifestyle']
    },
    subTheme: { 
      type: String, 
      enum: ['Walking and Hiking Vacations', 'Adventure Vacations', 'Wildlife Vacations', 'Expedition Cruises', 'Cultural Vacations', 'Foodie Vacations']
    },
    travelStyle: { 
      type: String, 
      enum: ['Family', 'Group', 'Solo', 'Couples', 'Honeymoon', 'Anniversary', 'Tailor-Made']
    },
    season: [{ 
      type: String, 
      enum: ['Spring', 'Summer', 'Fall', 'Winter'] 
    }],
    location: { type: String },

    duration:    { type: Number, required: true },
    price:       { type: PriceSchema, required: true },
    localPrice:  { type: Number, required: true },
    difficulty:  { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Challenging'], default: 'Moderate' },
    description: { type: String, required: true },
    cardImage:   { type: String, required: true },
    heroImage:   { type: String, required: true },
    galleryImages: [{ type: String }],
    included:  [{ type: String, trim: true }],
    excluded:  [{ type: String, trim: true }],
    itinerary: [ItineraryDaySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', TourSchema);