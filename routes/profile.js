const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Initialize MongoDB memory server
async function initializeMongoDB() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const profileSchema = new mongoose.Schema({
  id: Number,
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
});

const Profile = mongoose.model('Profile', profileSchema);

// Add a sample profile to the database
async function addSampleProfile() {
  const sampleProfile = {
    "id": 1,
    "name": "Elon Musk",
    "description": "Elon Reeve Musk (EE-lon; born June 28, 1971) is a businessman and investor. He is the founder, chairman, CEO, and CTO of SpaceX; angel investor, CEO, product architect, and former chairman of Tesla, Inc.; owner, chairman, and CTO of X Corp.; founder of the Boring Company and xAI; co-founder of Neuralink and OpenAI; and president of the Musk Foundation. He is the second wealthiest person in the world, with an estimated net worth of US$232 billion as of December 2023, according to the Bloomberg Billionaires Index, and $182.6  billion according to Forbes, primarily from his ownership stakes in Tesla and SpaceX.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://play-lh.googleusercontent.com/p6xC7ByyRWZjSAV65HGSzwo0_20UTtaHekhwuZentpVIZGKwWn-FQ8Dz42Ua68Nwj0pg=w240-h480-rw",
  };

  const newProfile = new Profile(sampleProfile);
  await newProfile.save();
}

// Initialize MongoDB and add a sample profile
initializeMongoDB().then(() => addSampleProfile());

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
      // If client prefers JSON, send the JSON response
      res.json(profiles);
    } else {
      // If client prefers HTML or content type is not specified, render the HTML template
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
