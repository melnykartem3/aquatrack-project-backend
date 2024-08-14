import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import  env  from '../utils/env.js';

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env("JWT_SECRET"));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Activation token expired or invalid');
    throw err;
  }
};