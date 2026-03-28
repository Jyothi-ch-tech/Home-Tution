const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (student)
const createBooking = asyncHandler(async (req, res) => {
  const { tutor, subject, date, time, duration, notes } = req.body;

  // Get tutor details for pricing
  const tutorProfile = await Tutor.findById(tutor);
  if (!tutorProfile) {
    res.status(404);
    throw new Error('Tutor not found');
  }

  const totalPrice = tutorProfile.hourlyRate * (duration || 1);

  const booking = await Booking.create({
    student: req.user._id,
    tutor,
    subject,
    date,
    time,
    duration: duration || 1,
    totalPrice,
    notes: notes || '',
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('student', 'name email phone')
    .populate({
      path: 'tutor',
      populate: { path: 'user', select: 'name email' },
    });

  res.status(201).json({
    success: true,
    data: populatedBooking,
  });
});

// @desc    Get my bookings
// @route   GET /api/bookings/mine
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.user.role === 'student') {
    filter.student = req.user._id;
  } else if (req.user.role === 'tutor') {
    // Find the tutor profile for this user
    const tutorProfile = await Tutor.findOne({ user: req.user._id });
    if (tutorProfile) {
      filter.tutor = tutorProfile._id;
    }
  }

  const bookings = await Booking.find(filter)
    .populate('student', 'name email phone')
    .populate({
      path: 'tutor',
      populate: { path: 'user', select: 'name email' },
    })
    .sort({ date: -1 });

  res.json({
    success: true,
    data: bookings,
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only the student or tutor involved can update
  const tutorProfile = await Tutor.findOne({ user: req.user._id });
  const isTutor = tutorProfile && booking.tutor.toString() === tutorProfile._id.toString();
  const isStudent = booking.student.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isTutor && !isStudent && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = req.body.status || booking.status;
  booking.notes = req.body.notes || booking.notes;

  const updatedBooking = await booking.save();

  const populatedBooking = await Booking.findById(updatedBooking._id)
    .populate('student', 'name email phone')
    .populate({
      path: 'tutor',
      populate: { path: 'user', select: 'name email' },
    });

  res.json({
    success: true,
    data: populatedBooking,
  });
});

// @desc    Delete/Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isStudent = booking.student.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isStudent && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Booking cancelled and removed',
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
};
