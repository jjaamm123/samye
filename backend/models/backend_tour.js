const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema(
  {
    day:         { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

// ── Hybrid Pricing Sub-Schema ─────────────────────────────────────────────────
// displayType controls how the price is presented on the frontend:
//   'exact'         → "$1,200"
//   'starting_from' → "Starting from $1,200"
//   'por'           → "Price on Request"  (amount is ignored in display)
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
    duration:    { type: Number, required: true },   // in days
    price:       { type: PriceSchema, required: true },
    localPrice:  { type: Number, required: true },   // NPR (Nepali Rupee)
    difficulty:  { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Challenging'], default: 'Moderate' },
    description: { type: String, required: true },
    cardImage:   { type: String, required: true },
    heroImage:   { type: String, required: true },
    galleryImages: [{ type: String }],
    included:  [{ type: String, trim: true }],  // ✅ rendered
    excluded:  [{ type: String, trim: true }],  // ❌ rendered
    itinerary: [ItineraryDaySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', TourSchema);