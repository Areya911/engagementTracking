const express = require('express');
const router = express.Router();

const {
    registerForActivity,
    updateEngagementStatus,
    getAllEngagements,
    getMyEngagements,
    updateProgress
} = require('../controllers/engagementController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// User
router.post('/register/:activityId', protect, registerForActivity);
router.get('/my', protect, getMyEngagements);
router.put('/progress/:id', protect, updateProgress);

// Admin
router.put('/:id', protect, isAdmin, updateEngagementStatus);
router.get('/', protect, isAdmin, getAllEngagements);

module.exports = router;