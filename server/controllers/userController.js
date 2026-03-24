const User = require('../models/User');
const Engagement = require('../models/Engagement');
const { getRiskLevel } = require('../utils/scoreEngine');

/* ===========================
   GET ALL USERS (Admin)
=========================== */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   UPDATE PROFILE
=========================== */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, department } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, department },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   STUDENT REPORT (Admin)
=========================== */
exports.getStudentReport = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const engagements = await Engagement.find({ user: userId }).populate("activity");

    const totalActivities = engagements.length;
    const attended = engagements.filter(e => e.attendanceStatus === "present").length;
    const absent   = engagements.filter(e => e.attendanceStatus === "absent").length;

    res.json({
      user,
      totalActivities,
      attended,
      absent,
      engagementScore: user.engagementScore || 0,
      riskLevel: getRiskLevel(user.engagementScore || 0),
      engagements
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   USER DASHBOARD (Student)
=========================== */
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId).select("-password");

    const engagements = await Engagement.find({ user: userId }).populate("activity").sort({ createdAt: -1 });

    const enrolled = engagements.length;
    const attended = engagements.filter(e => e.attendanceStatus === "present").length;
    const engagementScore = user.engagementScore || 0;
    const riskLevel = getRiskLevel(engagementScore);

    // Recent 5 activities
    const recentActivities = engagements.slice(0, 5);

    res.json({
      totalActivities: enrolled,
      enrolled,
      attended,
      engagementScore,
      riskLevel,
      engagements: recentActivities
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   GET STUDENT COURSES
=========================== */
exports.getStudentCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const engagements = await Engagement.find({ user: userId }).populate({
      path: "activity",
      match: { category: "Course" }
    });

    // Filter out null activities (non-Course)
    const courses = engagements.filter(e => e.activity);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   PROGRESS ANALYTICS (Student)
=========================== */
exports.getProgressAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId).select("engagementScore");

    const engagements = await Engagement.find({ user: userId }).populate("activity");

    // Weekly watch time (seconds → hours grouped by last-updated weekday)
    const weekMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    engagements.forEach(e => {
      if (!e.updatedAt) return;
      const day = new Date(e.updatedAt).toLocaleString("default", { weekday: "short" });
      if (weekMap[day] !== undefined) {
        weekMap[day] += (e.watchTime || 0) / 3600; // seconds → hours
      }
    });
    const weekly = Object.keys(weekMap).map(day => ({
      day,
      hours: Number(weekMap[day].toFixed(1))
    }));

    const engagementScore = user.engagementScore || 0;
    const riskLevel = getRiskLevel(engagementScore);

    // Course list with progress
    const courses = engagements
      .filter(e => e.activity?.category === "Course")
      .map(e => ({
        name:     e.activity.name,
        progress: e.progress || 0,
        hours:    Number(((e.watchTime || 0) / 3600).toFixed(1))
      }));

    res.json({ weekly, engagementScore, riskLevel, courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   PROFILE DATA (Student)
=========================== */
exports.getProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const engagements = await Engagement.find({ user: req.user._id }).populate("activity");

    const enrolled  = engagements.filter(e => e.activity?.category === "Course").length;
    const completed = engagements.filter(e => e.progress >= 100).length;

    const overallProgress = enrolled === 0
      ? 0
      : Math.round(
          engagements.reduce((acc, e) => acc + (e.progress || 0), 0) / enrolled
        );

    res.json({
      user,
      stats: {
        enrolled,
        completed,
        overallProgress,
        engagementScore: user.engagementScore || 0,
        riskLevel: getRiskLevel(user.engagementScore || 0),
        totalActivities: engagements.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};