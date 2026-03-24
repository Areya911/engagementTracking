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
required: function () {
return this.category !== "Course";
}
},

startDate: {
type: Date
},

endDate: {
type: Date
},

youtubeUrl: {
type: String,
default: ""
}

}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
