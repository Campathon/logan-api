const Mongoose = require('mongoose');
const {Schema} = Mongoose;
const connection = require('../app.database');

const cardSchema = new Schema({
    code: {
        type: Number,
        index: true,
    },

    name: {
        type: String,
        trim: true
    },

    image: {
        type: String,
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = connection.model('Card', cardSchema);