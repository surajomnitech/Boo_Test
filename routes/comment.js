// routes/comment.js

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Profile = require('../models/profile');

// POST route to add a new comment to a profile
router.post('/add/:profileId', async (req, res, next) => {
    try {
        const { title, description, mbti, enneagram, zodiac, userId } = req.body;
        const profileId = req.params.profileId;

        const newComment = new Comment({
            title,
            description,
            mbti,
            enneagram,
            zodiac,
            profileId,
            userId
        });

        await newComment.save();

        // Update the profile to include the new comment
        await Profile.findByIdAndUpdate(profileId, { $push: { comments: newComment._id } });

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        next(error);
    }
});

// GET route to retrieve all comments for a profile
router.get('/profile/:profileId', async (req, res, next) => {
    try {
        const profileId = req.params.profileId;

        // Populate comments with their details (MBTI, Enneagram, Zodiac)
        const comments = await Comment.find({ profileId }).populate(['mbti', 'enneagram', 'zodiac']);

        res.json(comments);
    } catch (error) {
        console.error('Error retrieving comments:', error);
        next(error);
    }
});

// POST route to like/unlike a comment
router.post('/like/:commentId', async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        // Toggle like status
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        res.json({ message: 'Like updated successfully', comment: updatedComment });
    } catch (error) {
        console.error('Error updating like:', error);
        next(error);
    }
});

// POST route to unlike a comment
router.post('/unlike/:commentId', async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        // Find the comment
        const comment = await Comment.findById(commentId);

        // Check if likes are greater than 0 before decrementing
        if (comment.likes > 0) {
            // Toggle unlike status
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { likes: -1 } },
                { new: true }
            );

            res.json({ message: 'Unlike updated successfully', comment: updatedComment });
        } else {
            // Likes are already at 0, return the comment without updating
            res.json({ message: 'Comment already has 0 likes', comment });
        }
    } catch (error) {
        console.error('Error updating unlike:', error);
        next(error);
    }
});


module.exports = router;
