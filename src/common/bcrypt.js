import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../logs/logger.js';

export const encryptPassword = async (password) => {
    try {
        const salt =config.BCRYPT_SALT_ROUNDS;
        const hash = await bcrypt.hash(password, salt);

        return hash;
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña');
    }
}

export const comparePassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        logger.error(error);
        throw new Error('Error al comparar la contraseña');
    }
}