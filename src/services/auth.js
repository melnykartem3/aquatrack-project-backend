import { UsersCollection } from "../db/models/Users.js";

export const findUser = filter => UsersCollection.findOne(filter);
