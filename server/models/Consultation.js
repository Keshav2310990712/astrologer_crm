const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client reference is required'],
    },
    astrologer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Consultation date and time is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Consultation duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
      default: 30,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    fee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Consultation', ConsultationSchema);
