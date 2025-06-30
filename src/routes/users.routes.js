import {Router} from 'express';
import userController from '../controllers/users.controller.js';
import validate from '../validators/validate.js';
import { createUserSchema } from '../validators/user.validate.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.route('/')
    .get(userController.getUsers)
    .post(validate(createUserSchema), userController.generateUser);

router.route('/:id')
    .get(authenticate, userController.getUserById)
    .put(authenticate, userController.updateUser)
    .delete(authenticate, userController.deleteUser)
    .patch(authenticate, userController.activeInactiveUser);
    
router.get('/list/pagination', userController.getUsersWithPagination);

router.get('/:id/tasks', authenticate, userController.getTasksByUser);
export default router;