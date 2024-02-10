// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST route to create a new user
router.post('/create', async (req, res, next) => {
    try {
        const { name, password } = req.body;

        // Validate input
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Create a new user
        const newUser = new User({ name, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }
});

// POST route for login
router.post('/login', async (req, res, next) => {
    try {
        const { name, password } = req.body;

        // Validate input
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }

        // Find the user by name and password
        const user = await User.findOne({ name, password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For simplicity, you can generate a token or use the user's ID as an identifier
        const token = user._id; // Use the user's ID as a token

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        next(error);
    }
});

// Get all users
router.get('/', async (req, res, next) => {
    try {
        // Retrieve all users from the database
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        next(error);
    }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Retrieve the user from the database based on the ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error retrieving user by ID:', error);
        next(error);
    }
});

module.exports = router;
