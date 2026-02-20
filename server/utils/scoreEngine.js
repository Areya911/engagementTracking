const Engagement = require("../models/Engagement");
const User = require("../models/User");

exports.recalculateUserScore = async (userId) => {
    const engagements = await Engagement.find({ user: userId });

    if (engagements.length === 0) {
        await User.findByIdAndUpdate(userId, { engagementScore: 0 });
        return 0;
    }

    let score = 0;

    engagements.forEach(e => {
        if (e.attendanceStatus === "registered") score += 5;
        if (e.attendanceStatus === "inprogress") score += 15;
        if (e.attendanceStatus === "completed") score += 30;

        score += Math.floor(e.progress / 10);
    });

    if (score > 100) score = 100;

    await User.findByIdAndUpdate(userId, { engagementScore: score });

    return score;
};