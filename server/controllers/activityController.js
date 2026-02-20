const Activity = require('../models/Activity');

// Create
exports.createActivity = async (req, res) => {
  try {
    const { name, category, description, date } = req.body;

    if (!name || !category || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const activity = await Activity.create({
      name,
      category,
      description,
      date
    });

    res.status(201).json(activity);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateActivity = async (req, res) => {
  try {
    const updated = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};