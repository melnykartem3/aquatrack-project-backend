import { Router } from 'express';
import {
  deleteWaterController,
  updateWaterController,
} from '../controllers/water.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createNewWaterController } from '../controllers/water.js';

import {
  getWaterPerDayController,
  getWaterPerMonthController,
} from '../controllers/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  validateBody(createWaterSchema),
  ctrlWrapper(createNewWaterController),
);

waterRouter.put('/:waterId', validateBody(), ctrlWrapper());

waterRouter.patch(
  '/:waterId',
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

waterRouter.delete('/:waterId', ctrlWrapper(deleteWaterController));

waterRouter.get('/perDay', ctrlWrapper(getWaterPerDayController));

waterRouter.get('/perMonth', ctrlWrapper(getWaterPerMonthController));

waterRouter.use('*', (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: ' record not found',
  });
  next();
});

export default waterRouter;
