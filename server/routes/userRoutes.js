const express = require('express');
const router = express.Router();

const { getAllUsers, updateProfile , getStudentReport} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const User = require("../models/User");

// Admin only
router.get('/', protect, isAdmin, getAllUsers);

// Get single user
router.get('/:id', protect, async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// Update profile
router.put('/profile', protect, updateProfile);

router.get("/report/:id", protect, isAdmin, getStudentReport);
module.exports = router;