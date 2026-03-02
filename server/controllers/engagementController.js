const Engagement = require('../models/Engagement');
const { recalculateUserScore } = require("../utils/scoreEngine");

/* =========================
   REGISTER FOR ACTIVITY
========================= */
exports.registerForActivity = async (req, res) => {
  try {
    const existing = await Engagement.findOne({
      user: req.user._id,
      activity: req.params.activityId
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const engagement = await Engagement.create({
      user: req.user._id,
      activity: req.params.activityId
    });

    await recalculateUserScore(req.user._id);
    res.status(201).json(engagement);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   COURSE WATCH + NOTES
========================= */
exports.updateCourseProgress = async (req, res) => {
  try {
    const { watchSeconds = 0, noteText } = req.body;

    const engagement = await Engagement.findById(req.params.id)
      .populate("activity");

    if (!engagement) {
      return res.status(404).json({ message: "Engagement not found" });
    }

    engagement.watchTime = (engagement.watchTime || 0) + watchSeconds;

    const gained = Math.floor(engagement.watchTime / 300) * 2;
    engagement.progress = Math.min(gained, 100);

    if (noteText) {
      engagement.notes.push({ text: noteText });
    }

    await engagement.save();
    await recalculateUserScore(engagement.user);

    res.json(engagement);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL ENGAGEMENTS (ADMIN)
========================= */
exports.getAllEngagements = async (req, res) => {
  try {
    const data = await Engagement.find()
      .populate('user', 'name email role')
      .populate('activity');

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET MY ENGAGEMENTS
========================= */
exports.getMyEngagements = async (req, res) => {
  try {
    const data = await Engagement.find({ user: req.user._id })
      .populate('activity');

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE ENGAGEMENT
========================= */
exports.getSingleEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findById(req.params.id)
      .populate("activity");

    if (!engagement) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(engagement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
exports.updateEngagementStatus = async (req, res) => {
  try {
    const updated = await Engagement.findByIdAndUpdate(
      req.params.id,
      { attendanceStatus: req.body.status },
      { new: true }
    );

    await recalculateUserScore(updated.user);
    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};