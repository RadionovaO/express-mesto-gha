const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Слишком короткое имя'],
    maxLength: [30, 'Слишком длинное имя'],
    required: true,
  },

  about: {
    type: String,
    minLength: [2, 'Слишком много символов'],
    maxLength: [30, 'Слишком мало символов'],
    required: true,
  },

  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
