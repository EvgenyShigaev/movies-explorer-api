const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFoundError = require('../errors/NotFoundError');

const registration = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User
      .create(
        {
          name,
          email,
          password: hash,
        },
      ))
    .then((user) => {
      res.status(201)
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

      res.status(200).send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Страница по указанному маршруту не найдена');
    })
    .then((user) => res.status(200).send({ data: user }))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Страница по указанному маршруту не найдена'))
    .then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректный запрос'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new Conflict('При обновлении профиля произошла ошибка '));
      } else {
        next(err);
      }
    });
};

module.exports = {
  registration,
  login,
  getUsers,
  updateUser,
};
