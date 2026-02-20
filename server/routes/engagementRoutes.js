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

router.put("/progress/:id", protect, async (req, res) => {
  const { progress, notes } = req.body;

  const engagement = await Engagement.findById(req.params.id);

  engagement.progress = progress;
  engagement.notes = notes;

  if (progress >= 100) {
    engagement.attendanceStatus = "completed";
  } else {
    engagement.attendanceStatus = "inprogress";
  }

  await engagement.save();
  res.json(engagement);
});

router.get("/:id", protect, async (req, res) => {
  const engagement = await Engagement.findById(req.params.id)
    .populate("activity");

  res.json(engagement);
});

module.exports = router;
