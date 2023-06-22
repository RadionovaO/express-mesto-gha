const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const regex = require('../middlewares/regex');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regex).required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), deleteCardById);

router.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().hex().length(24).required(),
  },
}), dislikeCard);

module.exports = router;
