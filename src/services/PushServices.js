const SocketIO = require('socket.io');

const _store = {
    io: null
};

exports.setup = (server) => {
    _store.io = SocketIO(server);

    return _store.io;
};

exports.getChanel = (chanel) => {
    return _store.io.to(chanel);
};

exports.emit = (event, payload) => {
    return _store.io.emit(event, payload);
};