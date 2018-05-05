const express = require('express');
const router = express.Router();


/**
 * Register routes.
 */
router.all('/', (req, res) => res.send('Cheat uh?'));
router.all('/ping', (req, res) => res.send('pong'));

/**
 * Exports.
 */
module.exports = router;