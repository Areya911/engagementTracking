const Activity = require('../models/Activity');
const Engagement = require('../models/Engagement');

/* =============================
   CREATE ACTIVITY
============================= */
exports.createActivity = async (req, res) => {
  try {
    const { name, category, description, date, startDate, endDate, youtubeUrl } = req.body;

    const isCourse = category === "Course";

    if (isCourse && !youtubeUrl) {
      return res.status(400).json({ message: "YouTube URL required for course" });
    }
    if (isCourse && (!startDate || !endDate)) {
      return res.status(400).json({ message: "Start date and end date required for course" });
    }
    if (!isCourse && !date) {
      return res.status(400).json({ message: "Date required for non-course activities" });
    }

    const activity = await Activity.create({
      name,
      category,
      description,
      date: isCourse ? undefined : date,
      startDate: isCourse ? startDate : undefined,
      endDate: isCourse ? endDate : undefined,
      youtubeUrl: isCourse ? youtubeUrl : ""
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
    const activities = await Activity.find().sort({ createdAt: -1 });
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
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const { name, category, description, date, startDate, endDate, youtubeUrl } = req.body;
    const isCourse = (category || activity.category) === "Course";

    activity.name        = name        || activity.name;
    activity.category    = category    || activity.category;
    activity.description = description !== undefined ? description : activity.description;
    activity.youtubeUrl  = youtubeUrl  !== undefined ? youtubeUrl  : activity.youtubeUrl;

    if (isCourse) {
      activity.date      = undefined;
      activity.startDate = startDate || activity.startDate;
      activity.endDate   = endDate   || activity.endDate;
    } else {
      activity.date      = date      || activity.date;
      activity.startDate = undefined;
      activity.endDate   = undefined;
    }

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
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   GET ACTIVITIES FOR STUDENT
============================= */
exports.getActivitiesForStudent = async (req, res) => {
  try {
    const userId = req.user.id;
    const activities  = await Activity.find();
    const engagements = await Engagement.find({ user: userId });

    const engagementMap = {};
    engagements.forEach(e => {
      engagementMap[e.activity.toString()] = {
        status:       e.attendanceStatus,
        engagementId: e._id
      };
    });

    const result = activities.map(activity => ({
      ...activity.toObject(),
      status:       engagementMap[activity._id.toString()]?.status || null,
      engagementId: engagementMap[activity._id.toString()]?.engagementId || null
    }));

    res.json(result);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   REGISTER FOR ACTIVITY
============================= */
exports.registerForActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.body;

    if (!activityId) return res.status(400).json({ message: "Activity ID required" });

    const existing = await Engagement.findOne({ user: userId, activity: activityId });
    if (existing) return res.status(400).json({ message: "Already registered" });

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