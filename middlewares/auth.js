const jwt = require('jsonwebtoken');

const authError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports.auth = (req, res, next) => {
  const token = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return authError(res);
  }
  req.user = payload;

  return next();
};
