// models/profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: String,
    description: String,
    mbti: String,
    enneagram: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    image: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
