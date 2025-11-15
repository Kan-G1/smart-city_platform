import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import requirementsRouter from './routes/requirements.js';
import clustersRouter from './routes/clusters.js';
import prioritizeRouter from './routes/prioritize.js';
import visualRouter from './routes/visual.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/requirements', requirementsRouter);
app.use('/api/clusters', clustersRouter);
app.use('/api/prioritize', prioritizeRouter);
app.use('/api/visual-model', visualRouter);

export default app;