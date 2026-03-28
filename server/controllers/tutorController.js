const asyncHandler = require('express-async-handler');
const Tutor = require('../models/Tutor');
const User = require('../models/User');

// @desc    Create tutor profile
// @route   POST /api/tutors
// @access  Private (tutor)
const createTutorProfile = asyncHandler(async (req, res) => {
  const { subjects, qualifications, experience, hourlyRate, location, bio, availability } = req.body;

  // Check if tutor profile already exists
  const existingProfile = await Tutor.findOne({ user: req.user._id });
  if (existingProfile) {
    res.status(400);
    throw new Error('Tutor profile already exists');
  }

  const tutor = await Tutor.create({
    user: req.user._id,
    subjects,
    qualifications,
    experience: experience || 0,
    hourlyRate,
    location: location || '',
    bio: bio || '',
    availability: availability || [],
  });

  res.status(201).json({
    success: true,
    data: tutor,
  });
});

// @desc    Get all tutors
// @route   GET /api/tutors
// @access  Public
const getAllTutors = asyncHandler(async (req, res) => {
  const { subject, location, minRate, maxRate, page = 1, limit = 10 } = req.query;

  // Build filter
  const filter = {};

  if (subject) {
    filter.subjects = { $regex: subject, $options: 'i' };
  }
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  if (minRate || maxRate) {
    filter.hourlyRate = {};
    if (minRate) filter.hourlyRate.$gte = Number(minRate);
    if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const tutors = await Tutor.find(filter)
    .populate('user', 'name email phone avatar')
    .sort({ rating: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Tutor.countDocuments(filter);

  res.json({
    success: true,
    data: tutors,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get tutor by ID
// @route   GET /api/tutors/:id
// @access  Public
const getTutorById = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.params.id).populate(
    'user',
    'name email phone avatar'
  );

  if (tutor) {
    res.json({
      success: true,
      data: tutor,
    });
  } else {
    res.status(404);
    throw new Error('Tutor not found');
  }
});

// @desc    Update tutor profile
// @route   PUT /api/tutors/:id
// @access  Private (tutor owner)
const updateTutor = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    res.status(404);
    throw new Error('Tutor not found');
  }

  // Check ownership
  if (tutor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  const updatedTutor = await Tutor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user', 'name email phone avatar');

  res.json({
    success: true,
    data: updatedTutor,
  });
});

// @desc    Delete tutor profile
// @route   DELETE /api/tutors/:id
// @access  Private (tutor owner or admin)
const deleteTutor = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    res.status(404);
    throw new Error('Tutor not found');
  }

  // Check ownership
  if (tutor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this profile');
  }

  await Tutor.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Tutor profile removed',
  });
});

module.exports = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
  updateTutor,
  deleteTutor,
};
