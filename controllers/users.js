const express = require('express');
const router = express.Router();

const connection = require('../config/config');

router.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM user WHERE ORDER BY followers DESC',
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results[0])
          : res.status(404).send('Users not found');
      }
    }
  );
});

router.get('/:id', (req, res) => {
  const idUser = req.params.id;
  connection.query(
    'SELECT * FROM user WHERE user_id = ?',
    [idUser],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results[0])
          : res.status(404).send('User not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { email, password, username, birthday, picture } = req.body;

  connection.query(
    'INSERT INTO user (email, password, username, birthday, picture) VALUES (?, ?, ?, ?, ?)',
    [email, password, username, birthday, picture],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (results.affectedRows < 1) {
        res.sendStatus(400);
      } else {
        res.status(201).json({ ...req.body, id: result.insertId });
      }
    }
  );
});

module.exports = router;
