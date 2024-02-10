const { app, startServer } = require('../app.js');
const assert = require('assert');
const request = require('supertest');

startServer();

describe('User API Tests', () => {
    let createdUserId;

    // Create a new user
    it('should create a new user', (done) => {
        const newUser = {
            name: 'John Doe',
            password: 'password123',
        };

        request(app)
            .post('/users/create')
            .send(newUser)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);

                // Assuming the response structure is { message, user: { _id, name } }
                const { message, user } = res.body;

                // Assert the presence of the '_id' property in the response
                assert.strictEqual(message, 'User created successfully');
                assert.strictEqual(user.hasOwnProperty('_id'), true);

                // Store the created user's ID for later use in other tests
                createdUserId = user._id;

                done();
            });
    });

    it('should login with the created user', (done) => {
        const loginUser = {
            name: 'John Doe',
            password: 'password123',
        };

        request(app)
            .post('/users/login')
            .send(loginUser)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.message, 'Login successful');
                assert.strictEqual(res.body.hasOwnProperty('token'), true);

                done();
            });
    });

    it('should get a user by ID', (done) => {
        request(app)
            .get(`/users/${createdUserId}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.hasOwnProperty('_id'), true);
                assert.strictEqual(res.body.hasOwnProperty('name'), true);
                assert.strictEqual(res.body.hasOwnProperty('password'), true);

                done();
            });
    });

    it('should get all users', (done) => {
        request(app)
            .get('/users')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(Array.isArray(res.body), true);

                done();
            });
    });


});
