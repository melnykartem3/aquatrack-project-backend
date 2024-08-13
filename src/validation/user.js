import joi from 'joi';
import { genderTypeList, emailRegexp } from '../constants/index.js';

const userSchema = joi.object({
  name: joi.string().default('User'),
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(8).required(),
  weight: joi.number(),
  timeSports: joi.number(),
  waterRate: joi.number(),
  gender: joi.string().valid(...genderTypeList),
  avatar: joi.string(),
});
const requestResetEmailSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  password: joi.string().required(),
  token: joi.string().required(),
});

const updateUserSchema = joi.object({
  name: joi.string(),
  email: joi.string().pattern(emailRegexp),
  weight: joi.number(),
  timeSports: joi.number(),
  waterRate: joi.number(),
  gender: joi.string().valid(...genderTypeList),
  avatar: joi.string(),
});


const userGoogleAuthCodeSchema = joi.object({
  idToken: joi.string().required()
});
export { userSchema, requestResetEmailSchema, resetPasswordSchema, userGoogleAuthCodeSchema, updateUserSchema };
