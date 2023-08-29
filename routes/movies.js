const router = require('express').Router();

const {
  validationCreateMovie,
  validationMovieId,
} = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validationCreateMovie, createMovie);

router.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = router;
