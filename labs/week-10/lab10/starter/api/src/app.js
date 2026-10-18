import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import userRoutes
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Campus Service API is running', version: '2.0.0' });
  });

  // Register routes
  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes); // ใช้ userRoutes ตรงนี้

  app.use(notFound);
  app.use(errorHandler);

  return app;
}