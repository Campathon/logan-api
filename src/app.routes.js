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

/**
 * Cards.
 */
const cardCtrl = require('./controllers/card');
router.get('/card', cardCtrl.getListCards);

/**
 * Exports.
 */
module.exports = router;