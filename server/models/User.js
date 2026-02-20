const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    department: {
        type: String,
        default: 'General'
    },

    engagementScore: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);