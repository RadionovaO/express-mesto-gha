const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');
const regex = require('../middlewares/regex');

router.use(cookieParser());

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), changeAvatar);

module.exports = router;
