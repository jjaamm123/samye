const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title:     { type: String, required: true },
    country:   { type: String, enum: ['Nepal', 'India', 'Tibet'], required: true, default: 'Nepal' },
    location:  { type: String, required: true },
    category:  { type: String, enum: ['Scenic Views', 'Customer Moments'], required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    mediaUrl:  { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);