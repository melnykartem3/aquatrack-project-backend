import { Router } from 'express';
import {
  deleteWaterController,
  updateWaterController,
} from '../controllers/water.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

import { authenticate } from '../middlewares/authenticate.js';

import {
  getWaterPerDayController,
  getWaterPerMonthController,
} from '../controllers/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post('/', validateBody(), ctrlWrapper());

waterRouter.put('/:waterId', validateBody(), ctrlWrapper());

waterRouter.patch('/:waterId', ctrlWrapper(updateWaterController));

waterRouter.delete('/:waterId', ctrlWrapper(deleteWaterController));

waterRouter.get('/perDay', ctrlWrapper(getWaterPerDayController));

waterRouter.get('/perMonth', ctrlWrapper(getWaterPerMonthController));

export default waterRouter;
