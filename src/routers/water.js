import { Router } from 'express';

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

waterRouter.put('/:userId', validateBody(), ctrlWrapper());

waterRouter.patch('/:userId', validateBody(), ctrlWrapper());

waterRouter.delete('/:userId', validateBody(), ctrlWrapper());

waterRouter.get('/perDay', ctrlWrapper(getWaterPerDayController));

waterRouter.get('/perMonth', ctrlWrapper(getWaterPerMonthController));

export default waterRouter;
