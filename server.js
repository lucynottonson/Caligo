const express = require('express');
const next = require('next');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env.local' }); // or your custom config file

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve static files if needed
  server.use(express.static('public'));

  // Handle all routes using Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});