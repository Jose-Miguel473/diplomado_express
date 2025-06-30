import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encryptPassword } from '../common/bcrypt.js';

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'userName', 'userPassword', 'status'],
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
  const { userName, userPassword } = req.body;
  try {
    const user = await User.create({
      userName,
      userPassword,
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
  const { userName, userPassword } = req.body;
  try {

    if (!userName && !userPassword) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordEncryp = await encryptPassword(userPassword);
    const user = await User.update({
      userName,
      userPassword: passwordEncryp,
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

async function getTasksByUser(req, res, next){
    const {id} = req.params;
    try {
        const user = await User.findOne({
            attributes: ['userName'],
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

export default { getUsers, generateUser, getUserById, updateUser, deleteUser, activeInactiveUser, getTasksByUser };