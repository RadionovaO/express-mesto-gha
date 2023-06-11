const { CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user.js');
const { BAD_REQUEST_ERROR,
    NOT_FOUND_ERROR,
    INTERNAL_SERVER_ERROR } = require('../errors/errors.js');

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
            if (err instanceof ValidationError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
            } else {
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
            };
});
};

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => res.status(200).send({ data: users }))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUserById = (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (!user) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' })
            } else {
                next(res.status(200).send({ data: user }));
            };
        })
        .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.updateUser = (req, res) => {
    const { name, about } = req.body;
    const owner = req.user._id;

    User.findByIdAndUpdate(owner, {
        name, about
    },
        {
            new: true,
        })
       // .orFail(new Error(NOT_FOUND_ERROR))
        .then((updatedUser) => res.send({ data: updatedUser }))
        .catch((err) => {
            if (err instanceof ValidationError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
            } else if (err instanceof CastError) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' })
            } else {
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
            };
        });
};

module.exports.changeAvatar = ( req, res ) => {
    const { avatar } = req.body;
    const owner = req.user._id;

    User.findByIdAndUpdate(owner, {
        avatar
    },
        {
            new: true,
        })
        .orFail(new Error(NOT_FOUND_ERROR))
        .then((avatar) => res.send({ data: avatar }))
        .catch((err) => {
            if (err instanceof ValidationError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
            } else if (err instanceof CastError) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' })
            } else { 
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
            };
        });
};


