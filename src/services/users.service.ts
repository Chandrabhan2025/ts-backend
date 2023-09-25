import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import User, { UserDocument, UserInput } from "../models/users";

export function createUser(input: UserInput) {
  return User.create(input);
}

export function findUser(
  query: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true }
) {
  return User.find(query, {}, options);
}

export function findAndUpdate(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) {
  return User.findOneAndUpdate(query, update, options);
}

export function deleteUser(query: FilterQuery<UserDocument>) {
  return User.deleteOne(query);
}
