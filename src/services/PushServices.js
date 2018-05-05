const SocketIO = require('socket.io');

const _store = {
    io: null
};

exports.setup = (server) => {
    _store.io = SocketIO(server);

    return _store.io;
};