import User from "../models/user-model";
import type { ICreateUser } from "../types/user-types";

const createUser = async (data: ICreateUser) => {
  const user = new User(data);
  return await user.save();
};

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export default {
  createUser,
  findUserByEmail,
};