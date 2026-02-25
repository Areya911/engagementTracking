const express = require('express');
const router = express.Router();
const {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity,
    getActivitiesForStudent,
    registerForActivity
} = require('../controllers/activityController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Admin only
router.post('/', protect, isAdmin, createActivity);
router.put('/:id', protect, isAdmin, updateActivity);
router.delete('/:id', protect, isAdmin, deleteActivity);

// Logged-in users
router.get('/', protect, getActivities);

router.get("/student", protect, getActivitiesForStudent);
router.post("/register", protect, registerForActivity);
module.exports = router;
