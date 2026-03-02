const express = require('express');
const router = express.Router();

const {
  registerForActivity,
  updateEngagementStatus,
  getAllEngagements,
  getMyEngagements,
  getSingleEngagement,
  updateCourseProgress
} = require('../controllers/engagementController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

/* USER */
router.post('/register/:activityId', protect, registerForActivity);
router.get('/my', protect, getMyEngagements);
router.put('/course/:id', protect, updateCourseProgress);
router.get('/:id', protect, getSingleEngagement);

/* ADMIN */
router.get('/', protect, isAdmin, getAllEngagements);
router.put('/:id', protect, isAdmin, updateEngagementStatus);

module.exports = router;