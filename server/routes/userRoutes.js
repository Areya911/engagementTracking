const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  updateProfile,
  getStudentReport,
  getUserDashboard,
  getStudentCourses,
  getProgressAnalytics,
  getProfileData
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const User = require("../models/User");

/* ===========================
   ADMIN GET ALL USERS
=========================== */
router.get("/", protect, isAdmin, getAllUsers);

/* ===========================
   USER DASHBOARD
=========================== */
router.get("/dashboard", protect, getUserDashboard);

/* ===========================
   STUDENT COURSES
=========================== */
router.get("/courses/student", protect, getStudentCourses);

/* ===========================
   UPDATE PROFILE
=========================== */
router.put("/profile", protect, updateProfile);

router.get("/progress/analytics", protect, getProgressAnalytics);

router.get("/profile/data", protect, getProfileData);
/* ===========================
   STUDENT REPORT (ADMIN)
=========================== */
router.get("/report/:id", protect, isAdmin, getStudentReport);

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