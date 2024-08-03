import UsersCollection from "../db/models/Users";

export const userService = (filter, updateData) => {
    return UsersCollection.findOneAndUpdate(filter, updateData, { new: true });
  };