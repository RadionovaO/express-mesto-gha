const router = require('express').Router();
const {
  celebrate, Segments, Joi,
} = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const regex = require('../middlewares/regex');

const { NOT_FOUND_ERROR } = require('../errors/errors');

router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), createUser);

router.use(auth);

router.use(routerUsers);
router.use(routerCards);

router.use('*', (req, res, next) => {
  next(res.status(NOT_FOUND_ERROR).send({ message: 'Передан некорректный путь' }));
});

module.exports = router;
