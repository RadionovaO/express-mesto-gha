const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании профиля'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    {
      name, about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => next(err));
};
