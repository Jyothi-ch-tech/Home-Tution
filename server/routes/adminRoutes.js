const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  verifyTutor,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/tutors/:id/verify', verifyTutor);
router.get('/stats', getDashboardStats);

module.exports = router;
