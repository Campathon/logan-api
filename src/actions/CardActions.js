const Card = require('../models/Card');
const getEnv = require('../helpers/getEnv');

const baseUrl = getEnv('/host');

exports.getListCards = () => {
    return Card.find({})
        .then(cards => {
            const cardsValidated = cards.map(card => {
                const object = card.toJSON();

                const imageUrl = baseUrl + '/assets/cards/' + object.image;

                return Object.assign({}, object, {
                    image: imageUrl
                });
            });

            return Promise.resolve(cardsValidated);
        });
};