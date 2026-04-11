const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: {
        type: String,
        required: true
    },
    destination: { 
        type: String, 
        required: true, 
        enum: ['Nepal', 'Tibet', 'India'] 
    },
    duration: { 
        type: Number, 
        required: true 
    }, 
    price: { 
        type: Number, 
        required: true 
    },
    difficulty: { 
        type: String, 
        enum: ['Easy', 'Moderate', 'Hard', 'Extreme'], 
        default: 'Moderate' 
    },
    itinerary: [{
        day: Number,
        activity: String
    }],
    featuredImage: { 
        type: String,
        default: 'default-tour-image.jpg'
    }, 
    gallery: [String], 
    description: { type: String, required: true },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Tour', tourSchema);