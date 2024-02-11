const { app, startServer } = require('../app.js');
const assert = require('assert');
const request = require('supertest');
const Profile = require('../models/profile'); // Import the Profile model
const User = require('../models/user'); // Import the Comment model
const Comment = require('../models/comment'); // Import the Comment model

startServer();


describe('API Tests', () => {

    it('should add a comment and retrieve the profile with comments sorted by most recent', async () => {
        try {
            // Get the first profile and user from the database
            const profile = await Profile.findOne({});

            // Check if profile is not null
            if (!profile) {
                console.error('No profile found');
                return;
            }

            const user = await User.findOne({});

            // Add a comment using the profileId and userId
            const response = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment',
                    description: 'This is a test comment.',
                    mbti: 'INTJ',
                    enneagram: '5w4',
                    zodiac: 'Libra',
                    userId: user._id,
                })
                .expect(201);

            // Now, retrieve the profile and check if the comments are sorted by most recent
            const profileResponse = await request(app)
                .get(`/profiles/${profile._id}`)
                .expect(200)
                .expect('Content-Type', /json/);

            const profileWithComments = JSON.parse(profileResponse.text);

            // Check if the comments are present and sorted by most recent
            assert.strictEqual(Array.isArray(profileWithComments.comments), true);
            assert.strictEqual(profileWithComments.comments.length > 0, true);
            assert.strictEqual(profileWithComments.comments[0].title, 'Test Comment');
        } catch (error) {
            // Handle any errors
            console.error('API Test Error:', error);
            throw error;
        }
    });

    it('should add comments, add likes, and retrieve the profile with comments sorted by most likes', async () => {
        try {
            // Get the first profile and user from the database
            const profile = await Profile.findOne({});

            // Check if profile is not null
            if (!profile) {
                console.error('No profile found');
                return;
            }

            const user = await User.findOne({});
            // Delete existing comments
            await Comment.deleteMany({ profileId: profile._id });

            // Add comments using the profileId and userId
            const comment1 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 1',
                    description: 'This is a test comment 1.',
                    mbti: 'INTJ',
                    enneagram: '',
                    zodiac: '',
                    userId: user._id,
                })
                .expect(201);

            const comment2 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 2',
                    description: 'This is a test comment 2.',
                    mbti: '',
                    enneagram: '5w4',
                    zodiac: '',
                    userId: user._id,
                })
                .expect(201);

            const comment3 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 3',
                    description: 'This is a test comment 3.',
                    mbti: '',
                    enneagram: '',
                    zodiac: 'Libra',
                    userId: user._id,
                })
                .expect(201);

            // Add likes to comments
            await request(app)
                .post(`/comments/like/${comment2.body.comment._id}`)
                .expect(200);

            await request(app)
                .post(`/comments/like/${comment2.body.comment._id}`)
                .expect(200);

            await request(app)
                .post(`/comments/like/${comment3.body.comment._id}`)
                .expect(200);

            // Retrieve the profile and check if the comments are sorted by most likes
            const profileResponse = await request(app)
                .get(`/profiles/${profile._id}?filter=all&sort=best`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/);

            const profileWithComments = JSON.parse(profileResponse.text);

            commentsArray = JSON.parse(profileResponse.text).profile.comments

            // Check if the comments are present and sorted by most likes
            assert.strictEqual(Array.isArray(commentsArray), true);
            assert.strictEqual(commentsArray.length > 0, true);
            assert.strictEqual(commentsArray[0].title, 'Test Comment 2');
            assert.strictEqual(commentsArray[1].title, 'Test Comment 3');
            assert.strictEqual(commentsArray[2].title, 'Test Comment 1');
        } catch (error) {
            console.error('API Test Error:', error);
            throw error;
        }
    });

    it('should add comments, add likes, and retrieve the profile with comments filtered by MBTI and sorted by most recent', async () => {
        try {
            // Get the first profile and user from the database
            const profile = await Profile.findOne({});
            const user = await User.findOne({});
            // Delete existing comments
            await Comment.deleteMany({ profileId: profile._id });

            // Add comments using the profileId and userId
            const comment1 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 1',
                    description: 'This is a test comment 1.',
                    mbti: 'INTJ',
                    enneagram: '',
                    zodiac: '',
                    userId: user._id,
                })
                .expect(201);

            const comment2 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 2',
                    description: 'This is a test comment 2.',
                    mbti: '',
                    enneagram: '5w4',
                    zodiac: '',
                    userId: user._id,
                })
                .expect(201);

            const comment3 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 3',
                    description: 'This is a test comment 3.',
                    mbti: '',
                    enneagram: '',
                    zodiac: 'Libra',
                    userId: user._id,
                })
                .expect(201);

            const comment4 = await request(app)
                .post(`/comments/add/${profile._id}`)
                .send({
                    title: 'Test Comment 4',
                    description: 'This is a test comment 4.',
                    mbti: 'INTJ',
                    enneagram: '',
                    zodiac: '',
                    userId: user._id,
                })
                .expect(201);

            // Add like to comment4
            await request(app)
                .post(`/comments/like/${comment4.body.comment._id}`)
                .expect(200);

            // Retrieve the profile and check if the comments are filtered by MBTI and sorted by most recent
            const profileResponse = await request(app)
                .get(`/profiles/${profile._id}?filter=mbti&sort=best`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/);

            const profileWithComments = JSON.parse(profileResponse.text);

            commentsArray = profileWithComments.profile.comments;

            // Check if the comments are present, filtered by MBTI, and sorted by most recent
            assert.strictEqual(Array.isArray(commentsArray), true);
            assert.strictEqual(commentsArray.length, 2); // Expecting exactly 2 comments
            assert.strictEqual(commentsArray[0].title, 'Test Comment 4');
            assert.strictEqual(commentsArray[1].title, 'Test Comment 1');

        } catch (error) {
            console.error('API Test Error:', error);
            throw error;
        }
    });



});
