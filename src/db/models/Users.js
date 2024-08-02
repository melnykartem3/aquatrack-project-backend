import { Schema, model } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp, genderTypeList } from '../../constants/index.js';

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
    },
    timeSports: {
      type: String,
    },
    waterRate: {
      type: String,
    },
    gender: {
      type: String,
      enum: genderTypeList,
      default: genderTypeList[0],
    },
    avatar: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UsersSchema.pre('findOneAndUpdate', setUpdateSettings);

UsersSchema.post('save', mongooseSaveError);

UsersSchema.post('findOneAndUpdate', mongooseSaveError);

const UsersCollection = model('users', UsersSchema);

export default UsersCollection;
