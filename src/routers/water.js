import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createNewWaterController } from '../controllers/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post('/', validateBody(createWaterSchema), ctrlWrapper(createNewWaterController));

waterRouter.put('/:userId', validateBody(updateWaterSchema), isValidId, ctrlWrapper());

waterRouter.patch('/:userId', validateBody(updateWaterSchema), isValidId, ctrlWrapper());

waterRouter.delete('/:userId', validateBody(updateWaterSchema), isValidId, ctrlWrapper());

waterRouter.get('/perDay', ctrlWrapper());

waterRouter.get('/perMonth', ctrlWrapper());

waterRouter.use('*', (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: ' record not found',
    });
    next();
});

export default waterRouter;
