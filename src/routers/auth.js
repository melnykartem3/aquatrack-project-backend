import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  getUserController,
  logoutController,
  refreshController,
  signInController,
  signUpController,
  updateUserController,
} from '../controllers/auth.js';
import upload from '../middlewares/multer.js';
import { isValidId } from '../validation/isValidId.js';
import userSchema from '../validation/user.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = Router();

authRouter.post('/signup', validateBody(userSchema), ctrlWrapper(signUpController));

authRouter.post('/signin', validateBody(userSchema), ctrlWrapper(signInController));

authRouter.get('/current', authenticate, ctrlWrapper(getUserController));

authRouter.patch(
  '/update/:userId',
  upload.single('photo'),
  isValidId,
  validateBody(userSchema),
  ctrlWrapper(updateUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
