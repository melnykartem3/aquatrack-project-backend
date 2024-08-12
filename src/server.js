import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import env from './utils/env.js';

import authRouter from './routers/auth.js';
import waterRouter from './routers/water.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'https://aquatrack-project-frontend.vercel.app',
  ];

  const corsOptions = { origin: allowedOrigins, credentials: true };

  app.use(cors(corsOptions));
  app.use(logger);
  app.use(cookieParser());
  app.use(express.json());

  app.use('/docs', swaggerDocs());
  app.use('/auth', authRouter);
  app.use('/water', waterRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server running on port ${port}`));
};

export default setupServer;
