const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    timeOfBirth: {
      type: String,
      trim: true,
      default: '', // Format: HH:MM (e.g. "14:30")
    },
    placeOfBirth: {
      type: String,
      trim: true,
      default: '',
    },
    astrologer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Allow unique email per astrologer (so different astrologers can have clients with the same email if needed)
ClientSchema.index({ email: 1, astrologer: 1 }, { unique: true });

module.exports = mongoose.model('Client', ClientSchema);
