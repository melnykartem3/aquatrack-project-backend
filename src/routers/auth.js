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
  requestResetEmailController,
  resetPasswordController,
  findAllUsersController,
  getGoogleOAuthUrlController,
  authGoogleController,
  registerGoogleController,
} from '../controllers/auth.js';
import upload from '../middlewares/multer.js';
import { isValidId } from '../validation/isValidId.js';
import {
  userSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  updateUserSchema,
  userGoogleAuthCodeSchema,
} from '../validation/user.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(userSchema),
  ctrlWrapper(signUpController),
);

authRouter.post(
  '/signin',
  validateBody(userSchema),
  ctrlWrapper(signInController),
);

authRouter.get('/current', authenticate, ctrlWrapper(getUserController));

authRouter.patch(
  '/update/:userId',
  upload.single('avatar'),
  isValidId,
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
authRouter.post(
  '/confirm-google-auth',
  validateBody(userGoogleAuthCodeSchema),
  ctrlWrapper(authGoogleController),
);

  authRouter.post(
    "/register-google",
    validateBody(userGoogleAuthCodeSchema),
     ctrlWrapper(registerGoogleController));


authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.get('/users', ctrlWrapper(findAllUsersController));

export default authRouter;
