const express = require('express');
const router = express.Router();
const User = require("../models/User");

const { getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { updateProfile } = require("../controllers/userController");
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


// GET all users
router.get("/", protect, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET single user by ID  ← THIS is what View Profile needs
router.get("/:id", protect, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});


// UPDATE admin profile (name, department, phone) - for logged-in users

router.put("/profile", protect, updateProfile);
module.exports = router;
