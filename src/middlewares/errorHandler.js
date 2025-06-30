import logger from '../logs/logger.js';

export default function errorHandler(err, req, res, next) {
    console.log(err.name);
    logger.error(err);
    if(err.name === 'ValidationError') {
        res.status(400).json({
            error: err.message
        });
    }else if(err.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: err.message
        });
    }else if(err.name === 'TokenExpiredError') {
        res.status(401).json({
            error: err.message
        });
    }else if(err.name === 'SequelizeValidationError') {
        res.status(400).json({
            error: err.message
        });
    }else {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}