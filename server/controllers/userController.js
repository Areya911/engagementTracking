const User = require('../models/User');
const Engagement = require('../models/Engagement');

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

    const { name, department, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, department, phone },
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   STUDENT REPORT
=========================== */
exports.getStudentReport = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const engagements = await Engagement.find({ user: userId })
      .populate("activity");

    const totalActivities = engagements.length;

    const attended = engagements.filter(
      e => e.attendanceStatus === "present"
    ).length;

    const absent = engagements.filter(
      e => e.attendanceStatus === "absent"
    ).length;

    const engagementScore =
      totalActivities === 0
        ? 0
        : Math.round((attended / totalActivities) * 100);

    res.json({
      user,
      totalActivities,
      attended,
      absent,
      engagementScore,
      engagements
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const engagements = await Engagement.find({ user: userId })
      .populate("activity");

    const totalActivities = engagements.length;

    const attended = engagements.filter(
      e => e.attendanceStatus === "present"
    ).length;

    const enrolled = engagements.length;

    const engagementScore =
      totalActivities === 0
        ? 0
        : Math.round((attended / totalActivities) * 100);

    let riskLevel = "Low";
    if (engagementScore < 40) riskLevel = "High";
    else if (engagementScore < 70) riskLevel = "Moderate";

    res.json({
      totalActivities,
      attended,
      enrolled,
      engagementScore,
      riskLevel,
      engagements
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    const { name, department, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, department, phone },
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   STUDENT REPORT
=========================== */
exports.getStudentReport = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const engagements = await Engagement.find({ user: userId })
      .populate("activity");

    const totalActivities = engagements.length;

    const attended = engagements.filter(
      e => e.attendanceStatus === "present"
    ).length;

    const absent = engagements.filter(
      e => e.attendanceStatus === "absent"
    ).length;

    const engagementScore =
      totalActivities === 0
        ? 0
        : Math.round((attended / totalActivities) * 100);

    res.json({
      user,
      totalActivities,
      attended,
      absent,
      engagementScore,
      engagements
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const engagements = await Engagement.find({ user: userId })
      .populate("activity");

    const totalActivities = engagements.length;

    const attended = engagements.filter(
      e => e.attendanceStatus === "present"
    ).length;

    const enrolled = engagements.length;

    const engagementScore =
      totalActivities === 0
        ? 0
        : Math.round((attended / totalActivities) * 100);

    let riskLevel = "Low";
    if (engagementScore < 40) riskLevel = "High";
    else if (engagementScore < 70) riskLevel = "Moderate";

    res.json({
      totalActivities,
      attended,
      enrolled,
      engagementScore,
      riskLevel,
      engagements
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const engagements = await Engagement.find({ user: userId })
      .populate({
        path: "activity",
        match: { isCourse: true }
      });

    res.json(engagements.filter(e => e.activity));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getStudentCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const engagements = await Engagement.find({ user: userId })
      .populate({
        path: "activity",
        match: { category: "Course" }
      });

    // remove non-course activities
    const courses = engagements.filter(e => e.activity);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProgressAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const engagements = await Engagement.find({ user: userId })
      .populate("activity");

    // ===============================
    // 1️⃣ WEEKLY WATCH TIME
    // ===============================

    const weekMap = {
      Mon: 0, Tue: 0, Wed: 0,
      Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    engagements.forEach(e => {
      if (!e.updatedAt) return;

      const day = new Date(e.updatedAt)
        .toLocaleString("default", { weekday: "short" });

      const hours = (e.progress || 0) * 0.05;

      if (weekMap[day] !== undefined) {
        weekMap[day] += hours;
      }
    });

    const weekly = Object.keys(weekMap).map(day => ({
      day,
      hours: Number(weekMap[day].toFixed(1))
    }));

    // ===============================
    // 2️⃣ ENGAGEMENT SCORE
    // ===============================

    const total = engagements.length;
    const completed = engagements.filter(
      e => e.progress >= 100
    ).length;

    const engagementScore =
      total === 0 ? 0 :
      Math.round((completed / total) * 100);

    let riskLevel = "Healthy";
    if (engagementScore < 40) riskLevel = "High";
    else if (engagementScore < 70) riskLevel = "Moderate";

    // ===============================
    // 3️⃣ COURSE PROGRESS LIST
    // ===============================

    const courses = engagements
      .filter(e => e.activity?.category === "Course")
      .map(e => ({
        name: e.activity.name,
        progress: e.progress || 0,
        hours: Number(((e.progress || 0) * 0.05).toFixed(1))
      }));

    res.json({
      weekly,
      engagementScore,
      riskLevel,
      courses
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const engagements = await Engagement.find({ user: req.user._id })
      .populate("activity");

    const enrolled = engagements.filter(
      e => e.activity?.category === "Course"
    ).length;

    const completed = engagements.filter(
      e => e.progress >= 100
    ).length;

    const overallProgress =
      enrolled === 0
        ? 0
        : Math.round(
            engagements.reduce((acc, e) => acc + (e.progress || 0), 0) /
              enrolled
          );

    // Simple streak logic (based on updatedAt activity)
    const today = new Date();
    let streak = 0;

    const sorted = engagements
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    for (let e of sorted) {
      const diff =
        Math.floor(
          (today - new Date(e.updatedAt)) / (1000 * 60 * 60 * 24)
        );

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      user,
      stats: {
        enrolled,
        completed,
        overallProgress,
        streak
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};