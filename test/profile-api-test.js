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
            .expect('Content-Type', /html/)  // Check the content type
            .end((err, res) => {
                if (err) return done(err);

                // Parse HTML and inspect its structure
                const $ = cheerio.load(res.text);
                const profileList = $('ul');  // Here i have not used the most ideal element. just wanted to demonstrate the test.

                // Assert the presence of the <ul> element
                assert.strictEqual(profileList.length > 0, true);

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

});
