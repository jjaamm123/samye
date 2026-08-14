// backend/models/Lead.js
// Stores leads captured via the "Download Itinerary & Pricing" gated modal.
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true
    },
    email: {
      type:     String,
      required: true,
      trim:     true,
      lowercase: true
    },
    // Optional — WhatsApp number supplied by the visitor
    whatsapp: {
      type:    String,
      trim:    true,
      default: ''
    },
    // Reference to the tour the lead came from
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Tour',
      default: null
    },
    // Snapshot of the tour title at capture time (denormalized for convenience)
    tourTitle: {
      type:    String,
      default: ''
    },
    // Admin workflow status
    status: {
      type:    String,
      enum:    ['new', 'contacted', 'converted', 'closed'],
      default: 'new'
    }
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model('Lead', LeadSchema);
