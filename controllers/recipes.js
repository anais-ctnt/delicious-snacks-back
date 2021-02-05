const express = require('express');
const router = express.Router();

const connection = require('../config/config');

router.get('/', (req, res) => {
  let sqlRequest = 'SELECT * FROM recipe WHERE 1=1 ';
  let sqlValues = [];

  if (req.query.type) {
    sqlValues.push(`${req.query.type}`);
    sqlRequest += `AND type = ? `;
  }

  if (req.query.category) {
    sqlValues.push(`${req.query.category}`);
    sqlRequest += `AND category = ? `;
  }

  if (req.query.search) {
    for (let i = 1; i <= 3; i++) {
      sqlValues.push('%' + req.query.search + '%');
    }
    sqlRequest += `AND (title LIKE ? OR ingredients LIKE ? OR description LIKE ?) `;
  }
  sqlRequest += `ORDER BY date_added`;

  connection.query(sqlRequest, sqlValues, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      results.length > 0
        ? res.status(200).json(results)
        : res.status(404).send('Recipes not found');
    }
  });
});

router.get('/drinks', (req, res) => {
  connection.query(
    'SELECT * FROM recipe WHERE category = "drinks" ORDER BY date_added',
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
    'SELECT * FROM recipe WHERE category = "snacks" ORDER BY date_added',
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
    'SELECT * FROM recipe JOIN user ON user.user_id = recipe.user_id WHERE recipe_id = ?',
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
    category,
    type,
    dateAdded,
    userId,
  } = req.body;

  connection.query(
    'INSERT INTO recipe (title, ingredients, description, picture, category, type, date_added, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      ingredients,
      description,
      picture,
      category,
      type,
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
