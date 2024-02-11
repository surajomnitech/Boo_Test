// purpose of this is to initiate the db server and also add a 
// profile at the inception to make it easy to test the app.

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user');
const Profile = require('../models/profile');

let mongoServer;

async function initializeMongoDB() {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create default user
        const defaultUser = {
            name: 'James',
            password: 'password',
        };
        const existingUser = await User.findOne({ name: defaultUser.name });
        if (!existingUser) {
            const newUser = new User(defaultUser);
            await newUser.save();
        }

        // Create default profile
        const defaultProfile = {
            name: 'Elon Musk',
            description: 'Elon Reeve Musk born June 28, 1971) is a businessman and investor. He is the founder, chairman, CEO, and CTO of SpaceX; angel investor, CEO, product architect, and former chairman of Tesla, Inc.; owner, chairman, and CTO of X Corp.; founder of the Boring Company and xAI; co-founder of Neuralink and OpenAI; and president of the Musk Foundation. He is the second wealthiest person in the world, with an estimated net worth of US$232 billion as of December 2023, according to the Bloomberg Billionaires Index, and $182.6  billion according to Forbes, primarily from his ownership stakes in Tesla and SpaceX.',
            mbti: 'INTJ',
            enneagram: '5w4',
            variant: 'sx/sp',
            tritype: 514,
            socionics: 'ILI',
            sloan: 'RCOAN',
            psyche: 'ITVL',
            image: 'https://play-lh.googleusercontent.com/p6xC7ByyRWZjSAV65HGSzwo0_20UTtaHekhwuZentpVIZGKwWn-FQ8Dz42Ua68Nwj0pg=w240-h480-rw',
        };

        const existingProfile = await Profile.findOne({ id: defaultProfile.id });
        if (!existingProfile) {
            const newProfile = new Profile(defaultProfile);
            await newProfile.save();
        }
    }
}

module.exports = { initializeMongoDB };
