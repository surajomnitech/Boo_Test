// models/comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title: String,
    description: String,
    mbti: String,
    enneagram: String,
    zodiac: String,
    likes: { type: Number, default: 0 },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
