const RoomActions = require('../actions/RoomActions');
const {sendSuccess, sendError} = require('../helpers/response');

exports.createRoom = (req, res) => {
    RoomActions.createRoom()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};