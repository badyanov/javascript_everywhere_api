const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'dev') {
  console.log('This is prod configuration!');
  require('dotenv').config();
}

const port = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Hello, World from Express.js!'));
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}...`)
);
