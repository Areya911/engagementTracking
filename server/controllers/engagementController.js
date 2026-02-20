const Engagement = require('../models/Engagement');
const Activity = require('../models/Activity');
const { recalculateUserScore } = require("../utils/scoreEngine");

// REGISTER (with duplicate prevention)
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
            activity: req.params.activityId,
            attendanceStatus: "registered"
        });

        await recalculateUserScore(req.user._id);

        res.status(201).json(engagement);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN updates status
exports.updateEngagementStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updated = await Engagement.findByIdAndUpdate(
            req.params.id,
            { attendanceStatus: status },
            { new: true }
        );

        await recalculateUserScore(updated.user);

        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// USER progress update (video watching)
exports.updateProgress = async (req, res) => {
    try {
        const { progress, notes } = req.body;

        const engagement = await Engagement.findById(req.params.id);

        if (!engagement) {
            return res.status(404).json({ message: "Not found" });
        }

        engagement.progress = progress;
        engagement.notes = notes;

        if (progress >= 100) {
            engagement.attendanceStatus = "completed";
        } else if (progress > 0) {
            engagement.attendanceStatus = "inprogress";
        }

        await engagement.save();

        await recalculateUserScore(engagement.user);

        res.json(engagement);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllEngagements = async (req, res) => {
  try {

    await autoMarkAbsent();

    const data = await Engagement.find()
      .populate('user', 'name email department engagementScore')
      .populate('activity');

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEngagements = async (req, res) => {
    try {
        const data = await Engagement.find({ user: req.user._id })
            .populate('activity');

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AUTO ABSENT CHECK
const autoMarkAbsent = async () => {
  const today = new Date();

  const pending = await Engagement.find({
    attendanceStatus: "registered"
  }).populate("activity");

  for (let e of pending) {
    if (e.activity?.date && new Date(e.activity.date) < today) {
      e.attendanceStatus = "absent";
      await e.save();
    }
  }
};