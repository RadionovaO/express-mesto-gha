const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { CastError } = require('mongoose').Error;
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUser = (req, res) => {
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
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.changeAvatar = (req, res) => {
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
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
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
    .catch(next);
};
