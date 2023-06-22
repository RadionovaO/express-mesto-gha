const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

/* const authError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
}; */

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!token) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
