import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });

    
}