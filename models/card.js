const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Слишком короткое название'],
    maxLength: [30, 'Слишком длинное название'],
    required: true,
  },

  link: {
    type: String,
    required: true,
    validate: [isURL, 'Некорректный URL'],
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
