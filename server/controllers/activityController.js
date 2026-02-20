const Activity = require('../models/Activity');

/* =============================
   CREATE ACTIVITY
============================= */
exports.createActivity = async (req, res) => {
  try {
    const { name, category, date } = req.body;

    const activity = await Activity.create({
      name,
      category,
      date
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