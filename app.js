require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();

app.use(cors);
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(express.json());

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Подключен к порту ${PORT}`);
});
