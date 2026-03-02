const Activity = require('../models/Activity');
const Engagement = require('../models/Engagement'); 
/* =============================
   CREATE ACTIVITY
============================= */

exports.createActivity = async (req, res) => {
  try {
    const { name, category, date, youtubeUrl } = req.body;

    const isCourse = category === "Course";

    if (isCourse && !youtubeUrl) {
      return res.status(400).json({ message: "YouTube URL required for course" });
    }

    const activity = await Activity.create({
      name,
      category,
      date,
      youtubeUrl: isCourse ? youtubeUrl : "",
      isCourse
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* =============================
   GET ALL ACTIVITIES
============================= */
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   UPDATE ACTIVITY
============================= */
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    activity.name = req.body.name || activity.name;
    activity.category = req.body.category || activity.category;
    activity.date = req.body.date || activity.date;

    const updated = await activity.save();

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   DELETE ACTIVITY
============================= */
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    await activity.deleteOne();

    res.json({ message: "Activity deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivitiesForStudent = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use id

    const activities = await Activity.find();

    const engagements = await Engagement.find({ user: userId });

    const engagementMap = {};
    engagements.forEach(e => {
      engagementMap[e.activity.toString()] = e.attendanceStatus;
    });

    const result = activities.map(activity => ({
      ...activity.toObject(),
      status: engagementMap[activity._id.toString()] || null
    }));

    res.json(result);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.registerForActivity = async (req, res) => {
  try {
    const userId = req.user.id;   // ✅ correct
    const { activityId } = req.body;

    if (!activityId) {
      return res.status(400).json({ message: "Activity ID required" });
    }

    const existing = await Engagement.findOne({
      user: userId,
      activity: activityId
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const engagement = await Engagement.create({
      user: userId,
      activity: activityId,
      attendanceStatus: "registered"
    });

    res.status(201).json(engagement);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};