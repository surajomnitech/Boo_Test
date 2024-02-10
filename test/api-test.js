const { app, startServer } = require('../app.js');
const assert = require('assert');
const request = require('supertest');
const cheerio = require('cheerio');

startServer();

describe('API Tests', () => {
    it('should get all profiles as HTML', (done) => {
        request(app)
            .get('/profiles')
            .expect(200)
            .expect('Content-Type', /html/)
            .end((err, res) => {
                if (err) return done(err);

                // Parse HTML and inspect its structure
                const $ = cheerio.load(res.text);
                const h2Element = $('h2:contains("All Profiles")');
                const liElement = $('li:contains("1 - A Martinez")');

                assert.strictEqual(h2Element.length > 0, true);
                assert.strictEqual(liElement.length > 0, true);
                done();
            });
    });

    it('should get all profiles as JSON', (done) => {
        request(app)
            .get('/profiles')
            .set('Accept', 'application/json')  // Request JSON response
            .expect(200)
            .expect('Content-Type', /json/)  // Check the content type
            .end((err, res) => {
                if (err) return done(err);

                // Parse JSON and inspect its structure
                const profiles = JSON.parse(res.text);
                assert.strictEqual(Array.isArray(profiles), true);
                done();
            });
    });

    // Add more tests as needed
});
