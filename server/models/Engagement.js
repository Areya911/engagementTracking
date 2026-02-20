const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },

  attendanceStatus: {
    type: String,
    enum: ['registered', 'present', 'absent'],
    default: 'registered'
  },

  progress: {
    type: Number,
    default: 0
  },

  notes: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model('Engagement', engagementSchema);