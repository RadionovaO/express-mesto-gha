const { ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbidden');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Преданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  const { _id } = req.user;
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Передан несуществующий ID карточки'))
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new ForbiddenError('Пост пренадлежит другому пользователю'));
      }

      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: owner },
  }, {
    new: true,
  })
    .orFail(new NotFoundError('Передан несуществующий id карточки'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: owner },
  }, {
    new: true,
  })
    .orFail(new NotFoundError('Передан несуществующий id карточки'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
