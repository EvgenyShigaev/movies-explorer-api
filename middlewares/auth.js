const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    return next(Unauthorized('Необходима авторизация'));
  }
};
