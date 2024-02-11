// app.js

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const profileRoutes = require('./routes/profile.js');
const userRoutes = require('./routes/user.js');

const app = express();
const port = process.env.PORT || 3000;

let mongoServer;

// Initialize MongoDB memory server
async function initializeMongoDB() {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

// Middleware to ensure MongoDB is initialized before route handling
app.use(async (req, res, next) => {
    await initializeMongoDB();
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/profiles', profileRoutes);
app.use('/users', userRoutes);

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

// Start the server if executed directly
if (require.main === module) {
    startServer();
}

// Export the app and the startServer function
module.exports = { app, startServer };
