const express = require('express');
const router = express.Router();

const {
    registerForActivity,
    updateEngagementStatus,
    getAllEngagements
} = require('../controllers/engagementController');

const { getMyEngagements } = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// User registers
router.post('/register/:activityId', protect, registerForActivity);
// USER gets their own activities
router.get('/my', protect, getMyEngagements);
// Admin updates status
router.put('/:id', protect, isAdmin, updateEngagementStatus);
// Admin views all
router.get('/', protect, isAdmin, getAllEngagements);


module.exports = router;
