const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }

  // Also delete associated tutor profile if exists
  await Tutor.findOneAndDelete({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User removed',
  });
});

// @desc    Verify a tutor
// @route   PUT /api/admin/tutors/:id/verify
// @access  Private (admin)
const verifyTutor = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.params.id);

  if (!tutor) {
    res.status(404);
    throw new Error('Tutor not found');
  }

  tutor.isVerified = true;
  await tutor.save();

  const populatedTutor = await Tutor.findById(tutor._id).populate(
    'user',
    'name email'
  );

  res.json({
    success: true,
    data: populatedTutor,
    message: 'Tutor verified successfully',
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTutors = await User.countDocuments({ role: 'tutor' });
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const verifiedTutors = await Tutor.countDocuments({ isVerified: true });
  const unverifiedTutors = await Tutor.countDocuments({ isVerified: false });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      pendingBookings,
      completedBookings,
      verifiedTutors,
      unverifiedTutors,
    },
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
  verifyTutor,
  getDashboardStats,
};
