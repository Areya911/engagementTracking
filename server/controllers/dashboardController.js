const User = require('../models/User');
const Activity = require('../models/Activity');
const Engagement = require('../models/Engagement');
const { getRiskLevel } = require('../utils/scoreEngine');

/* ===========================
   DASHBOARD STATS
=========================== */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers       = await User.countDocuments({ role: "user" });
    const totalActivities  = await Activity.countDocuments();
    const totalEngagements = await Engagement.countDocuments();

    // Engagement distribution
    const users = await User.find({ role: "user" }).select("engagementScore");
    const highRisk   = users.filter(u => (u.engagementScore || 0) < 20).length;
    const moderate   = users.filter(u => { const s = u.engagementScore || 0; return s >= 20 && s <= 50; }).length;
    const healthy    = users.filter(u => (u.engagementScore || 0) > 50).length;

    res.json({
      totalUsers,
      totalActivities,
      totalEngagements,
      engagementDistribution: { highRisk, moderate, healthy }
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

    const alerts = users.map(user => {
      const score = user.engagementScore || 0;
      return {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        department: user.department,
        score,
        riskLevel:  getRiskLevel(score)
      };
    });

    // Sort: high risk first, then moderate
    alerts.sort((a, b) => {
      const order = { high: 0, moderate: 1, healthy: 2 };
      return (order[a.riskLevel] || 2) - (order[b.riskLevel] || 2);
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   ANALYTICS
=========================== */
exports.getAnalytics = async (req, res) => {
  try {
    const engagements = await Engagement.find().populate("user", "department").populate("activity", "category");

    // Monthly registrations
    const monthlyMap = {};
    engagements.forEach(e => {
      const month = new Date(e.createdAt).toLocaleString("default", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const monthly = Object.keys(monthlyMap).map(m => ({ month: m, value: monthlyMap[m] }));

    // Department engagement
    const deptMap = {};
    engagements.forEach(e => {
      const dept = e.user?.department || "General";
      if (!deptMap[dept]) deptMap[dept] = { registered: 0, present: 0 };
      deptMap[dept].registered++;
      if (e.attendanceStatus === "present") deptMap[dept].present++;
    });
    const departmentData = Object.keys(deptMap).map(d => ({
      department: d,
      registered: deptMap[d].registered,
      present:    deptMap[d].present
    }));

    // Activity category distribution
    const catMap = {};
    engagements.forEach(e => {
      const cat = e.activity?.category || "Other";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categoryData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));

    res.json({ monthly, departmentData, categoryData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};