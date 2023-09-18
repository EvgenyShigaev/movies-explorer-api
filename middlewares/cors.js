const allowedCors = [
  'http://evgenius.nomoredomainsicu.ru/',
  'https://evgenius.nomoredomainsicu.ru/',

  'http://api.evgenius.nomoredomainsicu.ru/',
  'https://api.evgenius.nomoredomainsicu.ru/',

  'http://localhost:3000/',
  'https://localhost:3000/',

  'http://localhost:3001/',
  'https://localhost:3001/',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
