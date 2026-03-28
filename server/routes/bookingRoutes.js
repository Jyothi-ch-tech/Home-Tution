const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/mine').get(protect, getMyBookings);
router.route('/:id').put(protect, updateBookingStatus).delete(protect, deleteBooking);

module.exports = router;
