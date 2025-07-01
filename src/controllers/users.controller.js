import { User } from '../models/user.js';
import { Op } from 'sequelize';
import { Task } from '../models/task.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encryptPassword } from '../common/bcrypt.js';

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'password', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE
      }
    });
    res.json(users);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function generateUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password,
    });
    res.json(user);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    res.json(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { username, password } = req.body;
  try {

    if (!username && !password) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordEncryp = await encryptPassword(password);
    const user = await User.update({
      username,
      password: passwordEncryp,
    }, {
      where: {
        id
      }
    });
    res.json(user);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.destroy({
      where: {
        id
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function activeInactiveUser(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if(!status)
    {
      return res.status(400).json({ error: 'Status is required' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(user.status === status) return res.status(409).json({ message: `User is already ${status}` });
    
    
    user.status = status;
    await user.save();
    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

async function getUsersWithPagination(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = req.query.orderDir || 'DESC';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          username: {
            [Op.iLike]: `%${search}%`
          }
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderBy, orderDir.toUpperCase()]],
      attributes: ['id', 'username', 'status'],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      total: count,
      page,
      pages: totalPages,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}


async function getTasksByUser(req, res, next){
    const {id} = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include:[{
                model: Task,
                attributes:['name','done'],
                // where:{
                //     done: false,
                // }
            }],
            where:{
                id
            }
        })
        res.json(user)
    } catch (error) {
        next(error)
    }
}

export default { getUsers, generateUser, getUserById, updateUser, deleteUser, activeInactiveUser, getTasksByUser, getUsersWithPagination };