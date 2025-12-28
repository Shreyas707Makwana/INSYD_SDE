import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items';
import authRouter from './routes/auth';
import { errorHandler } from './utils/errorHandler';

const app = express();

const corsOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin, credentials: false }));
app.use(express.json());

app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
