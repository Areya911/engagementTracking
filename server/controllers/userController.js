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