const Mongoose = require('mongoose');
const {Schema} = Mongoose;
const connection = require('../app.database');

const roomSchema = new Schema({
    code: {
        type: String,
        index: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['waiting', 'ready', 'playing', 'finished'],
        default: 'waiting'
    },
    users: [{
        name: {
            type: String,
            trim: true
        },
        card: String,
        status: {
            type: String,
            default: 'active'
        }
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