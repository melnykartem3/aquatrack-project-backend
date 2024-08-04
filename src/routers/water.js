import { Router } from 'express';
import {
  deleteWaterController,
  updateWaterController,
} from '../controllers/water.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

const waterRouter = Router();

waterRouter.post('/', validateBody(), ctrlWrapper());

waterRouter.put('/:waterId', validateBody(), ctrlWrapper());

waterRouter.patch('/:waterId', ctrlWrapper(updateWaterController));

waterRouter.delete('/:waterId', ctrlWrapper(deleteWaterController));

waterRouter.get('/perDay', ctrlWrapper());

waterRouter.get('/perMonth', ctrlWrapper());

export default waterRouter;
