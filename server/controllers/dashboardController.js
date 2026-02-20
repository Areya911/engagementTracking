const User = require('../models/User');
const Activity = require('../models/Activity');
const Engagement = require('../models/Engagement');

/* ===========================
   DASHBOARD STATS
=========================== */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalActivities = await Activity.countDocuments();
    const totalEngagements = await Engagement.countDocuments();

    res.json({
      totalUsers,
      totalActivities,
      totalEngagements
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   ALERTS
=========================== */
exports.getAlerts = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const alerts = [];

    for (let user of users) {
      const engagements = await Engagement.find({ user: user._id });

      const total = engagements.length;
      const present = engagements.filter(e => e.attendanceStatus === "present").length;
      const completed = engagements.filter(e => e.attendanceStatus === "completed").length;

      const score =
        total === 0
          ? 0
          : Math.round(((present + completed) / total) * 100);

      let riskLevel = "healthy";

      if (score < 40) riskLevel = "high";
      else if (score < 70) riskLevel = "moderate";

      alerts.push({
        _id: user._id,
        name: user.name,
        score,
        riskLevel
      });
    }

    res.json(alerts);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};