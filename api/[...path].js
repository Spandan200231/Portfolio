
<old_str>
// This file will be created by the build process
// Vercel expects this structure for serverless functions
module.exports = require('../dist/vercel.js').default;
</old_str>
<new_str>
// Vercel serverless function entry point
const { createRequire } = require('module');
const require = createRequire(import.meta.url);

// Import the compiled Express app
const app = require('../dist/vercel.js');

// Export the Express app for Vercel
module.exports = app.default || app;
</new_str>
