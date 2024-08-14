import UsersCollection from '../db/models/Users.js';
import { hashValue } from '../utils/hash.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import Session from '../db/models/Session.js';

import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import env from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { verifyToken } from '../utils/verifyToken.js';
import { getNameFromGoogleTokenPayload, validateGoogleAuthCode } from '../utils/gogleOAuth2.js';
import { getTokensData } from '../utils/getTokensData.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const userService = {
  updateUser: (filter, updateData) => {
    return UsersCollection.findOneAndUpdate(filter, updateData, { new: true });
  },
  getUserById: (filter) => {
    return UsersCollection.findOne(filter);
  },
};

export const signup = async (data) => {
  const { password } = data;

  const hashedPassword = await hashValue(password);

  const newUser = await UsersCollection.create({
    ...data,
    password: hashedPassword,
  });

  return newUser;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `https://aquatrack-project-frontend.vercel.app/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const findAllUsers = () => UsersCollection.find();


export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateGoogleAuthCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) {
    throw createHttpError(401);
  }

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);

    user = await UsersCollection.create({
      email: payload.email,
      name: getNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  return await Session.create({
    userId: user._id,
    ...getTokensData(),
  });
};


export const activateUser = async (token) => {
  const entries = verifyToken(token);
  const { sub: _id, email } = entries;
  const user = await UsersCollection.findOne({
    email,
    _id,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (user.activated) {
    throw createHttpError(
      409,
      'Account has already been activated. Please, sign in',
    );
  }

  await UsersCollection.findOneAndUpdate({ email, _id }, { activated: true });

  return await Session.create({
    userId: user._id,
    ...getTokensData(),
  });
};

