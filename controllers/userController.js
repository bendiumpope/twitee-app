import userValidationSchema from "../utils/joiValidators/userValidation";
import User from "../models/userModel";
import { getUserProfile, signIn, signUp, updateUserProfile, verifyUserAccount } from "./handlerFactory/userHanderFactory";

const Url = process.env.URL;

export const userSignUp = (req, res, next) => {
  const link = `${Url}/verify`;
  signUp(User, userValidationSchema, link, req, res, next);
};

export const verifyUser = (req, res, next) => {
  verifyUserAccount(User, req, res, next);
};
export const userSignIn = (req, res, next) => {
  signIn(User, req, res, next);
};

export const getProfile = (req, res, next) => {
  getUserProfile(User, req, res, next);
};

export const updateProfile = (req, res, next) => {
  updateUserProfile(User, req, res, next);
};

export const deleteMe = (req, res, next) => {
  deleteSelf(User, req, res, next);
};
