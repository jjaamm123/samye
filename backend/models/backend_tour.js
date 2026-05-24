
const mongoose = require('mongoose');


const ItineraryDaySchema = new mongoose.Schema(
  {
    day:         { type: Number, required: true },       
    title:       { type: String, required: true },      
    description: { type: String, default: '' }           
  },
  { _id: false } 
);

const TourSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    destination:   { type: String, required: true, enum: ['Nepal', 'Tibet', 'India'] },
    duration:      { type: Number, required: true },     // in days
    price:         { type: Number, required: true },
    localPrice:    { type: Number, required: true },  // NPR (Nepali Rupee)
    difficulty:    { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Challenging'], default: 'Moderate' },
    description:   { type: String, required: true },
    featuredImage: { type: String, default: '/images/default.jpg' },
    gallery:       [{ type: String }],

    included: [{ type: String, trim: true }],  // ✅ rendered
    excluded: [{ type: String, trim: true }],  // ❌ rendered


    itinerary: [ItineraryDaySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', TourSchema);