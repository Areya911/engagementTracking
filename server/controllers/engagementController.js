const Engagement = require('../models/Engagement');

// User registers for activity
exports.registerForActivity = async (req, res) => {
    try {
        const engagement = await Engagement.create({
            user: req.user._id,
            activity: req.params.activityId
        });

        res.status(201).json(engagement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin updates attendance
exports.updateEngagementStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updateData = { attendanceStatus: status };

        if (status === 'completed') {
            updateData.completionDate = new Date();
        }

        const updated = await Engagement.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View engagements (Admin)
exports.getAllEngagements = async (req, res) => {
    try {
        const data = await Engagement.find()
            .populate('user', 'name email')
            .populate('activity', 'name category');

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
