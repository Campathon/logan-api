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

exports.joinRoom = ({name, roomCode}) => {
    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        const users = Array.isArray(room.get('rooms')) ? room.get('rooms') : [];
        const status = room.get('status');

        if (status === 'finished') {
            throw new Error('Phòng chơi đã kết thúc!');
        }

        if (status === 'playing') {
            throw new Error('Phòng đang chơi!');
        }

        if (status === 'ready') {
            throw new Error('Phòng chơi đã đủ người!');
        }

        const names = users.map(user => user.name);
        if (names.indexOf(name) !== -1) {
            return Promise.resolve(true);
        }

        const newUser = {
            name,
        };

        users.push(newUser);

        return room.update({
            $set: {
                users
            }
        }).then(() => Promise.resolve(true));
    });
};