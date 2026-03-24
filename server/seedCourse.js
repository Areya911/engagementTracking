require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Engagement = require('./models/Engagement');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edutrack');

  const user = await User.findOne({ email: 'kavya@edu.in' });
  if (!user) {
    console.log('User kavya@edu.in not found');
    process.exit(1);
  }

  const activity = await Activity.create({
    name: "Special Video Course",
    category: "Course",
    youtubeUrl: "https://youtu.be/QoIRX37VZpo?si=OEMzgePp3fUAYTub",
    startDate: new Date("2026-03-24"),
    endDate: new Date("2026-05-24"),
    description: "Assigned course video"
  });

  const engagement = await Engagement.create({
    user: user._id,
    activity: activity._id,
    attendanceStatus: "registered",
    progress: 0,
    watchTime: 0,
    notes: []
  });

  console.log("Seeded activity:", activity._id, "Engagement:", engagement._id);
  process.exit(0);
}

seed();
