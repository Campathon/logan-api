const express = require('express');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');
const robots = require('express-robots');
const getEnv = require('./helpers/getEnv');

const app = express();
const server = require('http').Server(app);


/**
 * Socket.io
 */
const PushServices = require('./services/PushServices');
const io = PushServices.setup(server);

io.on('connect', (socket) => {
    const {id} = socket;
    console.log('connected!', id);

    const {query} = socket.handshake;
    const roomCode = query.room || '';
    if (roomCode) {
        console.log(`Join room: ${roomCode}`);
        socket.join(`@room/${roomCode}`);
    }

    socket.on('joinRoom', (roomCode) => {
        console.log('Request join room: ', roomCode);

        socket.join(`@room/${roomCode}`);

        socket.emit('joinRoom', roomCode);
    });

    socket.on('disconnect', () => {
        console.log('disconnected!', id);
    });
});

app.use((req, res, next) => {
    res.io = io;
    next();
});


/**
 * Express configuration.
 */
app.disable('x-powered-by');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(errorHandler());
app.use(robots({UserAgent: '*', Disallow: '/'}));

/**
 * Config public folder.
 */
app.use(express.static(__dirname + '/../public'));

/**
 * Config routes.
 */
app.use(require('./app.routes'));

/**
 * Start Express server.
 */
const port = getEnv('/port');
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});