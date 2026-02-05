const User = require('../models/User');
const Activity = require('../models/Activity');
const Engagement = require('../models/Engagement');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalActivities = await Activity.countDocuments();
        const totalEngagements = await Engagement.countDocuments();

        const statusStats = await Engagement.aggregate([
            {
                $group: {
                    _id: "$attendanceStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        const activityStats = await Engagement.aggregate([
            {
                $group: {
                    _id: "$activity",
                    participants: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalUsers,
            totalActivities,
            totalEngagements,
            statusStats,
            activityStats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
