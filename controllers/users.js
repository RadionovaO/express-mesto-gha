const User = require('../models/user.js');
const { BAD_REQUEST_ERROR,
    NOT_FOUND_ERROR,
    INTERNAL_SERVER_ERROR } = require('../errors/errors.js');

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then((user) => res.status(201).send({ data: user }))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({message: 'Ошибка по умолчанию'}));
};

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => res.status(200).send({ data: users }))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUserById = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (!user) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' })
            } else {
                next(res.status(200).send({ data: user }));
            };
        })
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

