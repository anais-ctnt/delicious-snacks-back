const recipes = require('../controllers/recipes');
const users = require('../controllers/users');

module.exports = (app) => {
  app.use('/recipes', recipes);
  app.use('/users', users);
};
