const createConnection = require('./libs/createConnection');
const getEnv = require('./helpers/getEnv');

module.exports = createConnection({
    uri: getEnv('/mongodb')
});
