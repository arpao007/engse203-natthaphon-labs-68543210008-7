import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));

  /**
   * TODO W07-A2 (🏠 CP14) · เปลี่ยน logger เองเป็น morgan
   *   dev  → morgan('dev')       อ่านง่าย มีสี
   *   prod → morgan('combined')  ละเอียด เหมาะเก็บ log
   * ใช้ config.isProduction ตัดสิน
   */

  app.get('/', (req, res) => {
    res.json({ message: 'Campus Service API is running', version: '2.0.0' });
  });
  app.use('/api/requests', requestRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
