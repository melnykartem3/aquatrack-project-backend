import UsersCollection from '../db/models/Users.js';
import { hashValue } from '../utils/hash.js';

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
