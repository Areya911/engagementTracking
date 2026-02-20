const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: String,
    enum: ['Quiz', 'Hackathon', 'Conference', 'Workshop', 'Course'],
    required: true
  },

  description: String,

  date: {
    type: Date,
    required: true
  },

  youtubeLink: String

}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);