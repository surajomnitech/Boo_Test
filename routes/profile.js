const express = require('express');
const router = express.Router();
const Profile = require('../models/profile'); // Import the Profile model
const Comment = require('../models/comment'); // Import the Comment model

// GET route to render the profile page by ID
router.get('/:id', async (req, res, next) => {
  try {
    const profileId = req.params.id;
    const filter = req.query.filter;
    const sort = req.query.sort;

    // Retrieve the profile from the database based on the ID
    const profile = await Profile.findOne({ _id: profileId }).populate('comments');

    let filteredComments = profile.comments;
    // Filter comments based on criteria
    if (filter && filter !== 'all') {
      filteredComments = filteredComments.filter(comment => comment[filter] !== undefined && comment[filter] !== '');
    }

    // Sort comments
    if (sort === 'best') {
      // Sort by likes (descending order)
      filteredComments.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'recent') {
      // Sort by the most recent comments (descending order)
      filteredComments.sort((a, b) => b.createdAt - a.createdAt);
    }

    profile.comments = filteredComments
    // Check if the client prefers JSON
    const contentType = req.accepts(['html', 'json']);

    if (contentType === 'json') {
      // If the client prefers JSON, send the JSON response
      res.json({ profile });
    } else {
      // If the client prefers HTML or content type is not specified, render the HTML template
      res.render('profile_template', { profile });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error retrieving profile by ID:', error);
    next(error); // Pass the error to the error handler
  }
});

// GET route to render the list of profiles or return JSON
router.get('/', async (req, res, next) => {
  try {
    // Retrieve the list of profiles from the database
    const profiles = await Profile.find({});

    const contentType = req.accepts(['html', 'json']);

    if (contentType === 'json') {
      // If the client prefers JSON, send the JSON response
      res.json(profiles);
    } else {
      // If the client prefers HTML or content type is not specified, render the HTML template
      console.log('Rendering HTML');
      res.render('profile_list', { profiles });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error retrieving profiles:', error);
    next(error); // Pass the error to the error handler
  }
});

// POST route to create a new profile
router.post('/create', async (req, res, next) => {
  const newProfileData = req.body;

  const newProfile = new Profile(newProfileData);
  await newProfile.save();

  res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
});

module.exports = router;
