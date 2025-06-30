import { comparePassword } from "../common/bcrypt.js";
import config from "../config/env.js";
import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';

async function login(req, res, next){
    try {
        const { userName, userPassword } = req.body;
        const user = await User.findOne({
            where: {userName}
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // const passwordMatch = await user.comparePassword(userPassword);
        // if (!passwordMatch) {
        //     return res.status(401).json({ message: 'Invalid username or password' });
        // }
        
      const isMatch =  comparePassword(userPassword, user.userPassword);

      if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: eval(config.JWT_EXPIRATION) });
       
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
}

export default { login };