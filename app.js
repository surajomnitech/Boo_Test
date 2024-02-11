// app.js

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const profileRoutes = require('./routes/profile.js');
const userRoutes = require('./routes/user.js');
const { initializeMongoDB } = require('./seed/init_data');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/profiles', profileRoutes);
app.use('/users', userRoutes);

async function startServer() {
    await initializeMongoDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}


// Start the server if executed directly
if (require.main === module) {
    startServer();
}

// Export the app and the startServer function
module.exports = { app, startServer };
