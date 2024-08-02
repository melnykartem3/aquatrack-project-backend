import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  logoutController,
  refreshController,
  signInController,
  signUpController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/signup', validateBody(), ctrlWrapper(signUpController));

authRouter.post('/signin', validateBody(), ctrlWrapper(signInController));

authRouter.get('/:id', validateBody(), ctrlWrapper());

authRouter.post('/refresh', validateBody(), ctrlWrapper(refreshController));

authRouter.post('/logout', validateBody(), ctrlWrapper(logoutController));

export default authRouter;
