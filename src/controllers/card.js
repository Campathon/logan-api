const CardActions = require('../actions/CardActions');
const {sendSuccess, sendError} = require('../helpers/response');

exports.getListCards = (req, res) => {
    console.log('abc');

    CardActions.getListCards()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};