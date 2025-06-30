function validate(schema, target = 'body') {
    return (req, res, next) => {
        const data = req[target];

        if(!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                message: 'No se pudo validar el body'
            });
        }

        const {error, value} = schema.validate(data, {
            abortEarly: false,
            stripeUnknown: true
        });

        if(error) {
        return res.status(400).json({
            message: error.details.map(detail => detail.message).join(', ')
        });
        }  

        req[target] = value;
        next();
    }
}

export default validate;