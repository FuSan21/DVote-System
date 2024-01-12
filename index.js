const express = require('express');
const path = require('path');

const app = express();

// Basic routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/css/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/login.css'));
});

app.get('/js/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/login.js'));
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

