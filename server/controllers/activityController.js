const Activity = require('../models/Activity');

// Create Activity (Admin)
exports.createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Activities (Logged-in users)
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Activity (Admin)
exports.updateActivity = async (req, res) => {
    try {
        const updated = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Activity (Admin)
exports.deleteActivity = async (req, res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.json({ message: "Activity deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
