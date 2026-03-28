const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjects: {
      type: [String],
      required: [true, 'Please add at least one subject'],
    },
    qualifications: {
      type: String,
      required: [true, 'Please add your qualifications'],
    },
    experience: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Please add your hourly rate'],
    },
    location: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    availability: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tutor', tutorSchema);
