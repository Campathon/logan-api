const IncrementServices = require('../services/IncrementServices');
const Room = require('../models/Room');
const mathHelpers = require('../helpers/math');

const _newRoom = (code) => {
    const room = new Room({
        code,
        users: []
    });

    return room.save();
};

const _asignCards = (users, cardIds) => {
    let remainCards = cardIds;

    for (let i = 0; i < users.length; i++) {
        if (!remainCards.length) {
            break;
        }

        const random = mathHelpers.random(0, remainCards.length - 1);
        const card = remainCards[random];

        remainCards = remainCards.filter((id, index) => index !== random);
        users[i] = Object.assign({}, users[i], {card});
    }

    return Promise.resolve(users);
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

exports.playGame = ({cards, roomCode}) => {
    if (!cards || !Array.isArray(cards)) {
        return Promise.reject(new Error('Cards must be not empty!'));
    }

    const cardsValidated = cards
        .filter(card => !!card.id)
        .map(card => {
            return {
                id: card.id,
                total: parseInt(card.total, 10) || 0
            };
        })
        .filter(card => card.total > 0);

    let cardIds = [];

    cardsValidated.forEach(card => {
        const {id, total} = card;

        for (let i = 0; i < total; i++) {
            cardIds.push(id);
        }
    });

    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        const users = Array.isArray(room.get('rooms')) ? room.get('rooms') : [];

        return _asignCards(users, cardIds)
            .then(_users => {
                room.users = _users;

                return room.save();
            });
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