const IncrementServices = require('../services/IncrementServices');
const Room = require('../models/Room');

const _newRoom = (code) => {
    const room = new Room({
        code,
        users: []
    });

    return room.save();
};

exports.createRoom = () => {
    return IncrementServices.getIncrement('room')
        .then(inc => {
            return _newRoom(inc);
        })
        .catch(error => {
            IncrementServices.increase('room');

            return Promise.reject(error);
        });
};