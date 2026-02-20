const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,

    youtubeLink: {
        type: String,
        default: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },

    duration: {
        type: Number, // seconds
        default: 600
    }

}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
