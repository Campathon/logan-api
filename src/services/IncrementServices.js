const Increment = require('../models/Increment');

const _init = (field) => {
    const inc = new Increment({
        field,
        value: 1
    });

    return inc.save()
        .then(() => Promise.resolve(1));
};

const _inc = (field) => {
    return Increment.update(
        {
            field,
        },
        {
            $inc: {
                value: 1
            }
        }
    );
};

exports.getIncrement = (field) => {
    return Increment.findOne({
        field
    }).then(inc => {
        if (!inc) {
            return _init(field);
        }

        const value = inc.get('value');
        const validated = parseInt(value + 1, 10);

        return _inc(field)
            .then(() => Promise.resolve(validated));
    });
};

exports.increase = (field) => {
    return _inc(field);
};
