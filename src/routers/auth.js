import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  getUserInfController,
  logoutController,
  refreshController,
  signInController,
  signUpController,
  updateUserController,
} from '../controllers/auth.js';
import upload from '../middlewares/multer.js';
import { isValidId } from '../validation/isValidId.js';

const authRouter = Router();

authRouter.post('/signup', validateBody(), ctrlWrapper(signUpController));

authRouter.post('/signin', validateBody(), ctrlWrapper(signInController));


authRouter.get('/:userId', isValidId, validateBody(), ctrlWrapper(getUserInfController));

authRouter.patch('/:userId', upload.single('photo'), isValidId, validateBody(), ctrlWrapper(updateUserController));

authRouter.post('/refresh/:userId', ctrlWrapper(refreshController));

authRouter.post('/logout/:userId', ctrlWrapper(logoutController));

export default authRouter;
