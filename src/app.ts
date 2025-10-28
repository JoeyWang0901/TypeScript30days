import "reflect-metadata";
import express from 'express';
import { AppDataSource } from './config/db';
import todoRoutes from './routes/todoRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('Hello, iThome 2025!');
});

const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
.then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

