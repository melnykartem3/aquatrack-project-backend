import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import env from './utils/env.js';

import authRouter from './routers/auth.js';
import waterRouter from './routers/water.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const port = env('PORT', '3001');

const setupServer = () => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  const app = express();

  app.use(cors());
  app.use(logger);
  app.use(cookieParser());
  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/contacts', waterRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server running on port ${port}`));
};

export default setupServer;
