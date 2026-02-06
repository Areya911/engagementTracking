const express = require('express');
const router = express.Router();
const User = require("../models/User");

const { getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Admin only
router.get('/', protect, isAdmin, getAllUsers);
// DELETE ALL USERS
router.delete("/", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "All users deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
