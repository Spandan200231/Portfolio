
// Vercel serverless function entry point
const path = require('path');

// Import the compiled Express app
const app = require('../dist/vercel.js');

// Export the Express app for Vercel
module.exports = app.default || app;
