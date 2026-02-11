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
        enum: ['registered', 'attended', 'completed','absent'],
        default: 'registered'
    },
    completionDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Engagement', engagementSchema);
