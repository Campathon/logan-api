const Mongoose = require('mongoose');
const {Schema} = Mongoose;
const connection = require('../app.database');

const incrementSchema = new Schema({
    field: {
        type: String,
        trim: true,
        index: true
    },
    value: {
        type: Number,
        default: 1,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = connection.model('Increment', incrementSchema);