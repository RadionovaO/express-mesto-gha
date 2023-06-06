const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: [2, 'Слишком короткое название'],
        maxLength: [30, 'Слишком длинное название'],
        required: true
    },

    link: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.type.ObjectId,
        ref: 'user',
        required: true
    },

    likes: [
        {
            type: mongoose.Schema.type.ObjectId,
            ref: 'user',
            default: []
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('card', cardSchema);