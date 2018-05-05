const Confidence = require('confidence');

const data = {
    port: {
        $filter: 'env',
        $default: 6100,
        staging: 6101,
        production: 6100
    },
    host: {
        $filter: "env",
        $default: 'http://localhost:6100',
        staging: 'http://logan.blogk.xyz',
        production: 'http://logan.blogk.xyz',
    },
    mongodb: {
        $filter: "env",
        $default: 'mongodb://localhost:27017/logan',
        staging: process.env.LOGAN_MONGODB_URI || 'mongodb://localhost:27017/logan_dev',
        production: process.env.LOGAN_MONGODB_URI || 'mongodb://localhost:27017/logan',
    },
};

const store = new Confidence.Store(data);
const criteria = {
    env: process.env.NODE_ENV || 'development'
};

module.exports = (key, defaultValue = null) => {
    return store.get(key, criteria) || defaultValue;
};