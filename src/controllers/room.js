const RoomActions = require('../actions/RoomActions');
const {sendSuccess, sendError} = require('../helpers/response');

exports.createRoom = (req, res) => {
    RoomActions.createRoom()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.getUsers = (req, res) => {
    const defaultArgs = {
        room: ''
    };

    const {room} = Object.assign({}, defaultArgs, req.body);

    RoomActions.getUsers(room)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.closeRoom = (req, res) => {
    const defaultArgs = {
        room: ''
    };

    const {room} = Object.assign({}, defaultArgs, req.body);

    RoomActions.closeRoom(room)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.readyRoom = (req, res) => {
    const defaultArgs = {
        room: ''
    };

    const {room} = Object.assign({}, defaultArgs, req.body);

    RoomActions.readyRoom(room)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.joinRoom = (req, res) => {
    const defaultArgs = {
        name: '',
        room: ''
    };

    const {name, room} = Object.assign({}, defaultArgs, req.body);

    RoomActions.joinRoom({name, roomCode: room})
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.playGame = (req, res) => {
    const defaultArgs = {
        cards: [],
        room: ''
    };

    const {cards, room} = Object.assign({}, defaultArgs, req.body);

    console.log(req.body);

    RoomActions.playGame({cards, roomCode: room})
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};