// backend/models/inquiry.js
const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true },
    subject:     { type: String, required: true, trim: true },
    message:     { type: String, required: true },

    travelMonth: {
      type: String,
      enum: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December',
        'Flexible' 
      ],
      default: 'Flexible'
    },
    groupSize: {
      type: String,
      enum: ['1', '2', '3-5', '6+'],
      default: '2'
    },
    budgetRange: {
      type: String,
      enum: ['Standard', 'Premium', 'Luxury'],
      default: 'Standard'
    },

    relatedTour:      { type: mongoose.Schema.Types.ObjectId, ref: 'Tour',      default: null },
    relatedAdventure: { type: mongoose.Schema.Types.ObjectId, ref: 'Adventure', default: null },

    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new'
    },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);