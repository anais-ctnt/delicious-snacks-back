const express = require('express');
const router = express.Router();

const connection = require('../config/config');

router.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM recipe ORDER BY date_added',
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results)
          : res.status(404).send('Recipes not found');
      }
    }
  );
});

router.get('/drinks', (req, res) => {
  connection.query(
    'SELECT * FROM recipe WHERE snacks = 0 ORDER BY date_added',
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results)
          : res.status(404).send('Drinks not found');
      }
    }
  );
});

router.get('/snacks', (req, res) => {
  connection.query(
    'SELECT * FROM recipe WHERE snacks = 1 ORDER BY date_added',
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results)
          : res.status(404).send('Snacks not found');
      }
    }
  );
});

router.get('/:id', (req, res) => {
  const idRecipe = req.params.id;
  connection.query(
    'SELECT * FROM recipe WHERE recipe_id = ?',
    [idRecipe],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        results.length > 0
          ? res.status(200).json(results[0])
          : res.status(404).send('Recipe not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const {
    title,
    ingredients,
    description,
    picture,
    snacks,
    healthy,
    date_added: dateAdded,
    user_id: userId,
  } = req.body;

  connection.query(
    'INSERT INTO recipe (title, ingredients description, picture, snacks, healthy, date_added user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      ingredients,
      description,
      picture,
      snacks,
      healthy,
      dateAdded,
      userId,
    ],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (results.affectedRows < 1) {
        res.sendStatus(400);
      } else {
        res.status(201).json({ ...req.body, id: results.insertId });
      }
    }
  );
});

module.exports = router;
