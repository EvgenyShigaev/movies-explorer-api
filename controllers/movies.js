const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie
    .find({ owner })
    .populate('owner')
    .then((movies) => {
      res.status(200).send(movies);
    }).catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      movie
        .populate('owner');
      res
        .status(200)
        .send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Страница по указанному маршруту не найдена');
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      const _id = req.user._id.toString();
      if (owner === _id) {
        Movie.deleteOne(movie)
          .then(() => {
            res.status(200).send({ message: 'Запрос выполнен' });
          })
          .catch(next);
      } else {
        throw new Forbidden('Доступ запрещён');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
