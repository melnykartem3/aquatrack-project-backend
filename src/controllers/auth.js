import createHttpError from 'http-errors';

import {
  createSession,
  deleteSession,
  findSession,
} from '../services/session.js';
import env from '../utils/env.js';
import { randomBytes } from 'node:crypto';
import {
  generateAuthUlr,
  validateGoogleAuthCode,
  getGoogleOAuthName,
} from '../utils/gogleOAuth2.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToPublicDir } from '../utils/saveFileToPublicDir.js';
import { userService } from '../services/auth.js';

import {
  signup,
  findUser,
  requestResetToken,
  resetPassword,
  findAllUsers,
} from '../services/auth.js';
import { compareValue } from '../utils/hash.js';

export const signUpController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'This email already in use');
  }

  const newUser = await signup(req.body);
  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const signInController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(404, 'User with this email not found');
  }
  if (!(await compareValue(password, user.password))) {
    throw createHttpError(401, 'Wrong password');
  }

  const { accessToken, refreshToken, _id, refreshTokenValidUntil } =
    await createSession(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });

  res.clearCookie('cookieName');

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: accessToken,
    },
  });
};

export const getUserController = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: 200,
    message: `Successfully found user`,
    data: {
      user,
    },
  });
};

const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const updateUserController = async (req, res) => {
  const { userId } = req.params;
  let photo = '';

  if (req.file) {
    try {
      if (enable_cloudinary === 'true') {
        photo = await saveFileToCloudinary(req.file, 'photos');
      } else {
        photo = await saveFileToPublicDir(req.file, 'photos');
      }
    } catch (error) {
      throw createHttpError(500, 'Error uploading photo');
    }
  }

  const updatedUser = await userService.updateUser(
    { _id: userId },
    {
      ...req.body,
      $push: { avatar: photo },
    },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user!',
    data: updatedUser,
  });
};

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'None',
    secure: true,
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const currentSession = await findSession({ _id: sessionId, refreshToken });

  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }

  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }
  const newSession = await createSession(currentSession.userId);
  console.log(newSession);

  setupResponseSession(res, newSession);
  res.json({
    status: 200,
    message: 'User signed in successfully',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  console.log('sessionId from cookies:', sessionId);

  if (!sessionId) {
    console.log('No sessionId found in cookies');
    return res.status(401).json({ message: 'Session not found' });
  }

  await deleteSession({ _id: sessionId });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const findAllUsersController = async (req, res) => {
  const users = await findAllUsers();

  const userCount = users.length === 0 ? 10 : users.length;

  res.status(200).json({
    status: 200,
    message: 'Successfully found number of users',
    data: userCount,
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUlr();
  res.json({
    status: 200,
    message: 'Google OAuth generate successfully',
    data: {
      url,
    },
  });
};
export const authGoogleController = async (req, res) => {
  const { code } = req.body;
  const ticket = await validateGoogleAuthCode(code);
  const userPayload = ticket.getPayload();

  if (!userPayload) {
    throw createHttpError(401);
  }

  let user = await findUser({ email: userPayload.email });
  if (!user) {
    const signupData = {
      email: userPayload.email,
      password: randomBytes(10),
      name: getGoogleOAuthName(userPayload),
    };

    user = await signup(signupData);
  }

  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'User signin successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
};
