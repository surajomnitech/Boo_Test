// routes/profile.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/profile'); // Import the Profile model

// GET route to render the profile page by ID
router.get('/:id', async (req, res, next) => {
  try {
    const profileId = req.params.id;

    // Retrieve the profile from the database based on the ID
    const profile = await Profile.findOne({ id: profileId });

    // Render the profile page with the retrieved profile
    res.render('profile_template', { profile });
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
    console.log(contentType);
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
