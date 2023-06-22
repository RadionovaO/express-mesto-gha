const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isURL } = require('validator');
const UnauthorizedError = require('../errors/unauthorized');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Слишком короткое имя'],
    maxLength: [30, 'Слишком длинное имя'],
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minLength: [2, 'Слишком много символов'],
    maxLength: [30, 'Слишком мало символов'],
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [isURL, 'Некорректный URL'],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Некорректный email'],
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((mached) => {
          if (!mached) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
