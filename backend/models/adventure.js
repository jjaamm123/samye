
const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sportType: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    intensity: { type: String, required: true },
    description: { type: String, required: true },
    featuredImage: { type: String, required: true },
    gallery: [String],
    minAge: { type: String, default: "16+" },
    included: [String], 
    safetyNotes: { type: String },
    itinerary: [mongoose.Schema.Types.Mixed] 
});

module.exports = mongoose.model('Adventure', adventureSchema);