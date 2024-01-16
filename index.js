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

app.get('/css/index.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/index.css'));
});

app.get('/css/admin.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/css/admin.css'));
});

app.get('/js/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/login.js'));
});

app.get('/js/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/js/app.js'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

app.get('/dist/app.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/dist/app.bundle.js'));
});

app.get('/assets/eth5.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/assets/eth5.jpg'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'));
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

