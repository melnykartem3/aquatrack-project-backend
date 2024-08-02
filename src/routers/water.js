import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

const waterRouter = Router();

waterRouter.post('/', validateBody(), ctrlWrapper());

waterRouter.put('/:userId', validateBody(), ctrlWrapper());

waterRouter.patch('/:userId', validateBody(), ctrlWrapper());

waterRouter.delete('/:userId', validateBody(), ctrlWrapper());

waterRouter.get('/perDay', ctrlWrapper());

waterRouter.get('/perMonth', ctrlWrapper());

export default waterRouter;
