const Mongoose = require('mongoose');
const {Schema} = Mongoose;
const connection = require('../app.database');

const roomSchema = new Schema({
    code: {
        type: Number,
        index: true,
    },
    users: [{
        type: String,
        trim: true,
    }],
    updated: {
        type: Date,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = connection.model('Room', roomSchema);