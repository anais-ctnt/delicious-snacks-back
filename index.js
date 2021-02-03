const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/index');

require('dotenv').config();

const SERVER_PORT = process.env.SERVER_PORT || 8000;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

router(app);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${SERVER_PORT}`);
  }
});
