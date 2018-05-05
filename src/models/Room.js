const Mongoose = require('mongoose');
const {Schema} = Mongoose;
const connection = require('../app.database');

const roomSchema = new Schema({
    code: {
        type: Number,
        index: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['waiting', 'ready', 'playing', 'finished'],
        default: 'waiting'
    },
    users: [{
        name: String,
        card: String
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