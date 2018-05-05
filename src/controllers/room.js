const RoomActions = require('../actions/RoomActions');
const {sendSuccess, sendError} = require('../helpers/response');

exports.createRoom = (req, res) => {
    RoomActions.createRoom()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

exports.joinRoom = (req, res) => {
    const defaultArags = {
        name: '',
        room: ''
    };

    const {name, room} = Object.assign({}, defaultArags, req.body);

    RoomActions.joinRoom({name, roomCode: room})
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};