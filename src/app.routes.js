const express = require('express');
const router = express.Router();


/**
 * Register routes.
 */
router.all('/', (req, res) => res.send('Cheat uh?'));
router.all('/ping', (req, res) => res.send('pong'));

/**
 * Rooms.
 */
const roomCtrl = require('./controllers/room');
router.post('/rooms', roomCtrl.createRoom);
router.post('/rooms/join', roomCtrl.joinRoom);
router.post('/rooms/ready', roomCtrl.readyRoom);
router.post('/rooms/play', roomCtrl.playGame);
router.post('/rooms/users', roomCtrl.getUsers);

/**
 * Cards.
 */
const cardCtrl = require('./controllers/card');
router.get('/cards', cardCtrl.getListCards);

/**
 * Exports.
 */
module.exports = router;