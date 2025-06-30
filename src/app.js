import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import errorHandler  from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticate } from './middlewares/authenticate.js';

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticate, taskRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;