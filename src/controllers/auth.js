import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import path from 'node:path';

import { signup, findUser } from '../services/auth.js';
import { compareValue } from '../utils/hash.js';
import { createSession } from '../services/session.js';

export const signUpController = async (req, res) => {
  const email = req.body.email;
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
  });
  res.cookie('userId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: accessToken,
    },
  });
};

export const getUserInfController = async (req, res) => {};

export const refreshController = async (req, res) => {};

export const logoutController = async (req, res) => {};
