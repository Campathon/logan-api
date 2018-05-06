const IncrementServices = require('../services/IncrementServices');
const Room = require('../models/Room');
const Card = require('../models/Card');
const mathHelpers = require('../helpers/math');
const objectHelpers = require('../helpers/object');
const PushServices = require('../services/PushServices');
const getEnv = require('../helpers/getEnv');

const baseUrl = getEnv('/host');

const _newRoom = (code) => {
    const room = new Room({
        code,
        users: []
    });

    return room.save();
};

const _assignCards = (users, cardIds) => {
    const newUsers = [];
    let remainCards = cardIds;

    for (let i = 0; i < users.length; i++) {
        const user = users[i].toJSON ? users[i].toJSON() : users[i];

        if (!remainCards.length) {
            newUsers.push(user);
            continue;
        }

        const random = mathHelpers.random(0, remainCards.length - 1);
        const card = remainCards[random];

        remainCards = remainCards.filter((id, index) => index !== random);

        newUsers.push(Object.assign({}, user, {card}));
    }

    return Promise.resolve(newUsers);
};

const _mapCards = (users) => {
    const cardIds = users
        .map(user => user.card)
        .filter(id => !!id);


    return Card.find({
        _id: {
            $in: cardIds
        }
    }).then(cards => {
        const cardsValidated = cards.map(card => {
            const object = card.toJSON();

            const imageUrl = baseUrl + '/assets/cards/' + object.image;

            return Object.assign({}, object, {
                image: imageUrl
            });
        });

        const hashCards = objectHelpers.arrayToObject(cardsValidated, '_id');

        const updatedUsers = users.map(user => {
            const card = user.card || '';
            const object = hashCards[card] || '';
            const obj = user.toJSON ? user.toJSON() : user;

            return Object.assign({}, obj, {card: object});
        });

        return Promise.resolve(updatedUsers);
    });
};

exports.getUsers = (roomCode) => {
    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        const users = Array.isArray(room.get('users')) ? room.get('users') : [];

        return _mapCards(users);
    });
};

exports.readyRoom = (roomCode) => {
    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        room.status = 'ready';

        return room.save();
    }).then(room => {
        const code = room.get('code');
        const roomChanel = PushServices.getChanel(`@room/${code}`);
        roomChanel.emit('roomReady', room.toJSON());

        return Promise.resolve(room);
    });
};

exports.closeRoom = (roomCode) => {
    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        room.status = 'finished';

        return room.save();
    }).then(room => {
        const code = room.get('code');
        const roomChanel = PushServices.getChanel(`@room/${code}`);
        roomChanel.emit('roomClosed', room.toJSON());

        return Promise.resolve(room);
    });
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
        const users = Array.isArray(room.get('users')) ? room.get('users') : [];

        return _assignCards(users, cardIds)
            .then(_users => {
                console.log('assignCards', _users);

                room.users = _users;
                room.status = 'playing';

                return room.save();
            });
    }).then(room => {
        const object = room.toJSON();
        const code = room.get('code');
        const users = Array.isArray(room.get('users')) ? room.get('users') : [];

        return _mapCards(users)
            .then(mapUsers => {
                const roomChanel = PushServices.getChanel(`@room/${code}`);
                roomChanel.emit('startGame', mapUsers);
                console.log('startGame', mapUsers);

                return Promise.resolve(Object.assign({}, object, {users: mapUsers}));
            });
    });
};

exports.leaveRoom = ({name, roomCode}) => {
    return Room.findOne({
        code: roomCode
    }).then(room => {
        if (!room) {
            throw new Error("Mã phòng không tồn tại!");
        }

        return Promise.resolve(room);
    }).then(room => {
        const users = Array.isArray(room.get('users')) ? room.get('users') : [];
        const names = users.map(user => user.name);

        if (names.indexOf(name) === -1) {
            throw new Error(`Tài khoản ${name} không tồn tại.`);
        }

        room.users = users.map(user => {
            const object = user.toJSON();

            if (object.name === name) {
                return Object.assign({}, object, {status: 'left'});
            }

            return object;
        });

        return room.save();
    }).then(room => {
        const code = room.get('code');
        const users = Array.isArray(room.users) ? room.users : [];

        return _mapCards(users)
            .then(mapUsers => {
                let user = {};
                mapUsers.forEach(_user => {
                    if (_user.name === name) {
                        user = _user;
                    }
                });

                const roomChanel = PushServices.getChanel(`@room/${code}`);
                roomChanel.emit('usersChanged', mapUsers);

                return Promise.resolve(user);
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
        const users = Array.isArray(room.get('users')) ? room.get('users') : [];
        const status = room.get('status');

        if (status === 'finished') {
            throw new Error('Phòng chơi đã kết thúc!');
        }

        const names = users.map(user => user.name);

        if (names.indexOf(name) !== -1) {
            return Promise.resolve(room);
        }

        if (status === 'playing') {
            throw new Error('Phòng đang chơi!');
        }

        if (status === 'ready') {
            throw new Error('Phòng chơi đã đủ người!');
        }

        const newUser = {
            name,
        };

        users.push(newUser);
        room.users = users;

        return room.save();
    }).then(room => {
        const code = room.get('code');
        const users = Array.isArray(room.users) ? room.users : [];

        return _mapCards(users)
            .then(mapUsers => {
                let user = {};
                mapUsers.forEach(_user => {
                    if (_user.name === name) {
                        user = _user;
                    }
                });

                const roomChanel = PushServices.getChanel(`@room/${code}`);
                roomChanel.emit('newUser', user);
                roomChanel.emit('usersChanged', mapUsers);

                console.log('newUser', user);
                console.log('usersChanged', mapUsers);

                return Promise.resolve(user);
            });
    });
};