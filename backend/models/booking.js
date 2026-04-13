const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tourTitle: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    travelDates: { type: String, required: true },
    groupSize: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);