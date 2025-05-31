
// Vercel serverless function entry point
try {
  // Import the compiled Express app
  const app = require('../dist/vercel.js');
  
  // Export the Express app for Vercel
  module.exports = app.default || app;
} catch (error) {
  console.error('Failed to load Express app:', error);
  module.exports = (req, res) => {
    res.status(500).json({ error: 'Failed to load application', details: error.message });
  };
}
