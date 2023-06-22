const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const authError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!token) {
      return authError(res);
    }
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return authError(res);
  }
  req.user = payload;

  return next();
};
