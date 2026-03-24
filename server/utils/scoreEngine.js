const Engagement = require("../models/Engagement");
const User = require("../models/User");

/* =============================================
   SCORE RULES (based on category + attendance)
   Course completion   → +40
   Workshop attendance → +15
   Hackathon           → +25
   Quiz                → +10
   Conference          → +8
   Course progress contributes proportionally
============================================= */

const SCORE_MAP = {
  Course:     40,
  Workshop:   15,
  Hackathon:  25,
  Quiz:       10,
  Conference:  8
};

exports.recalculateUserScore = async (userId) => {
  try {
    const engagements = await Engagement.find({ user: userId }).populate("activity");

    if (engagements.length === 0) {
      await User.findByIdAndUpdate(userId, { engagementScore: 0 });
      return 0;
    }

    let score = 0;

    engagements.forEach(e => {
      const category = e.activity?.category;
      const base = SCORE_MAP[category] || 0;

      if (category === "Course") {
        // Course: score proportional to progress (0–100%)
        const fraction = Math.min((e.progress || 0) / 100, 1);
        score += base * fraction;
      } else {
        // Non-course: score awarded only when marked "present"
        if (e.attendanceStatus === "present") {
          score += base;
        }
      }
    });

    // No hard cap — engagement score can exceed 100 for very
    // active students; cap at 200 to avoid runaway values
    score = Math.min(Math.round(score), 200);

    await User.findByIdAndUpdate(userId, { engagementScore: score });
    return score;
  } catch (err) {
    console.error("Score engine error:", err.message);
    return 0;
  }
};

/* Risk level helper (exported for use in controllers) */
exports.getRiskLevel = (score) => {
  if (score < 20)  return "high";
  if (score <= 50) return "moderate";
  return "healthy";
};