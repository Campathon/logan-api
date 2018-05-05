exports.sendSuccess = (req, res, extended) => result => {
    const data = Object.assign({}, extended, {
        success: true,
        data: result
    });

    return res.send(data);
};

exports.sendError = (req, res) => (error) => {
    console.error('RESPONSE_ERROR', error);

    const code = error.code || null;
    const message = typeof error === 'string' ? error : error.message || '';

    return res.send({
        success: false,
        message,
        code
    });
};

exports.catchError = (req, res) => (error, status = 500) => {
    console.error('RESPONSE_ERROR', error);

    const message = typeof error === 'string' ? error : error.message || '';
    const code = error.code || null;

    return res.status(status).send({
        success: false,
        message,
        code
    });
};
