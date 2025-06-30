import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Status } from '../constants/index.js';
import { Task } from './task.js';
import { encryptPassword } from '../common/bcrypt.js';
import logger from '../logs/logger.js';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull:{
                msg: "El nombre del usuario no puede ser nulo"
            },
        }
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull:{
                msg: "La contraseña del usuario no puede ser nulo" 
            },
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: "El estatus del usuario debe ser ACTIVE o INACTIVE"
            }
        }
    }
})

User.hasMany(Task);
Task.belongsTo(User);

User.beforeCreate(async (user) => {
    try {
        user.userPassword = await encryptPassword(user.userPassword);
        
    } catch (error) {
        logger.error(error);
        next(error);
    }
})

// User.beforeUpdate(async (user) => {
//     try {
//         user.userPassword = await encryptPassword(user.userPassword);
        
//     } catch (error) {
//         logger.error(error);
//         next(error);}
// })