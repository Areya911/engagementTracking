const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  updateProfile,
  getStudentReport,
  getUserDashboard
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const User = require("../models/User");

/* ===========================
   ADMIN GET ALL USERS
=========================== */
router.get("/", protect, isAdmin, getAllUsers);

router.get("/dashboard", protect, getUserDashboard);
/* ===========================
   STUDENT REPORT (MUST COME BEFORE :id)
=========================== */
router.get("/report/:id", protect, isAdmin, getStudentReport);

/* ===========================
   UPDATE PROFILE
=========================== */
router.put("/profile", protect, updateProfile);

/* ===========================
   GET SINGLE USER (KEEP LAST)
=========================== */
router.get("/:id", protect, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = router;