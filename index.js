import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectionDB from './config/db.js';
import cookieParser from 'cookie-parser';
import todosRoutes from './routes/todos.js';
import usersRoutes from './routes/users.js';

dotenv.config();
const app = express();
app.use(cors());

connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/todos', todosRoutes);
app.use('/api/users', usersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
