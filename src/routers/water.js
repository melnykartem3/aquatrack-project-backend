import { Router } from 'express';
import { deleteWaterController ,updateWaterController } from '../controllers/water.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

const waterRouter = Router();

waterRouter.post('/', validateBody(), ctrlWrapper());

waterRouter.put('/:userId', validateBody(), ctrlWrapper());

waterRouter.patch('/:userId', ctrlWrapper(updateWaterController));

waterRouter.delete('/:userId', ctrlWrapper(deleteWaterController));

waterRouter.get('/perDay', ctrlWrapper());

waterRouter.get('/perMonth', ctrlWrapper());

export default waterRouter;
