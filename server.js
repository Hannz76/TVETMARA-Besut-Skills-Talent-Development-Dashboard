import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from './auth.js';
import itemsRouter from './items.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', source: 'csv-dummy-database' });
});

app.use('/api/auth', authRouter);
app.use('/api', itemsRouter);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});