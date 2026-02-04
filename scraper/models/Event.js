// This file creates a symbolic link to the backend models
// so the scraper can use the same Event model
// In production, consider using a shared npm package

const path = require('path');

module.exports = {
    Event: require(path.join(__dirname, '../../backend/models/Event')),
    User: require(path.join(__dirname, '../../backend/models/User')),
    Interest: require(path.join(__dirname, '../../backend/models/Interest'))
};
