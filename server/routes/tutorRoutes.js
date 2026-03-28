const express = require('express');
const router = express.Router();
const {
  createTutorProfile,
  getAllTutors,
  getTutorById,
  updateTutor,
  deleteTutor,
} = require('../controllers/tutorController');
const { protect, tutor } = require('../middleware/authMiddleware');

router.route('/').get(getAllTutors).post(protect, tutor, createTutorProfile);
router
  .route('/:id')
  .get(getTutorById)
  .put(protect, tutor, updateTutor)
  .delete(protect, tutor, deleteTutor);

module.exports = router;
