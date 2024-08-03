import UsersCollection from "../db/models/Users.js";

export const findUser = (filter) => UsersCollection.findOne(filter);

export const userService = {
  updateUser: (filter, updateData) => {
    return UsersCollection.findOneAndUpdate(filter, updateData, { new: true });
  },
  getUserById: (filter) => {
    return UsersCollection.findOne(filter);
  }
};
