import UsersCollection from '../db/models/Users.js';
import { hashValue } from '../utils/hash.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import env from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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
