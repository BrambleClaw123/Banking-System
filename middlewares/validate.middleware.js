const validate = (schema, property) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }
        req[property] = value;
        next();
    };
};

module.exports = validate