const { CastError, ValidationError } = require('mongoose').Error;
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
    .orFail(new Error('NotFound'))
    .then((card) => res.send({data: card}))
    .catch((err) => {
        if (err instanceof CastError) {
            res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' })
        } else if (err.message === 'NotFound') {
            res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' })
        } else {
            res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
        };
    });
};

module.exports.likeCard = (req, res) => {
    const owner = req.user._id;

    Card.findByIdAndUpdate(req.params.cardId, {
        $addToSet: { likes: owner }
    }, {
        new: true
    })
        .orFail(new Error('NotFound'))
        .then((card) => res.send({data: card}))
        .catch((err) => {
            if (err instanceof CastError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' })
            } else if (err.message === 'NotFound') {
                res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' })
            } else {
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
            };
        });
};

module.exports.dislikeCard = (req, res, next) => {
    const owner = req.user._id;

    Card.findByIdAndUpdate(req.params.cardId, {
        $pull: { likes: owner }
    }, {
        new: true
    })
        .orFail(new Error('NotFound'))
        .then((card) => res.send({data: card}))
        .catch((err) => {
            if (err instanceof CastError) {
                res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы  некорректные данные для снятия лайка' })
            } else if (err.message === 'NotFound') {
                res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' })
            } else {
                res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
            };
    });
};
