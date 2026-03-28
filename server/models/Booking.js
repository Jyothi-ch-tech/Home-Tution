const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify the date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify the time'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in hours'],
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
