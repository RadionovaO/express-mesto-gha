const { ValidationError } = require('mongoose').Error;
const Card = require('../models/card.js');
const { BAD_REQUEST_ERROR,
    NOT_FOUND_ERROR,
    INTERNAL_SERVER_ERROR } = require('../errors/errors.js');

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;

    Card.create({ name, link, owner })
        .then((card) => res.status(201).send({ data: card }))
        .catch((err) => {
            if (err instanceof ValidationError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Преданы некорректные данные' })
            } else {
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
            } 
        });
};

module.exports.getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.send({ data: cards }))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};  

module.exports.deleteCardById = (req, res, next) => {
    Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
            if (!card) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Карточка по указанному _id не найдена' })
            } else {
                next(res.status(200).send({ data: card }));
            };
        })
        .catch((err) =>
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
        );
};

module.exports.likeCard = (req, res, next) => {
    const owner = req.user._id;

    Card.findByIdAndUpdate(req.params.cardId, {
        $addToSet: { likes: owner }
    }, {
        new: true
    })
        .then((card) => {
            if (!card) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' })
            } else {
                next(res.status(200).send({ data: card }));
            };
        })
        .catch((err) =>
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
        );
};

module.exports.dislikeCard = (req, res, next) => {
    const owner = req.user._id;

    Card.findByIdAndUpdate(req.params.cardId, {
        $pull: { likes: owner }
    }, {
        new: true
    })
        .then((card) => {
            if (!card) {
                res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' })
            } else {
                next(res.status(200).send({ data: card }));
            };
        })
        .catch((err) =>
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' })
        );
};
