import joi from 'joi';
import { genderTypeList, emailRegexp } from '../constants/index.js';

const userSchema = joi.object({
  name: joi.string().default('User'),
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(6).required(),
  weight: joi.string(),
  timeSports: joi.string(),
  waterRate: joi.string(),
  gender: joi.string().valid(...genderTypeList),
  avatar: joi.string(),
});

export default userSchema;