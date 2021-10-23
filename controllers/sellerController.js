
import sellerValidationSchema from "../utils/joiValidators/sellerValidation";
import Seller from "../models/sellerModel";
import { deleteSelf, deleteUser, getUser, getUserProfile, getUsers, signIn, signUp, updateUser, updateUserProfile, userChangePassword, userForgotPassword, userResetPassword, verifyUser } from "./handlerFactory/userHanderFactory";

const Url = process.env.URL;

export const sellerSignUp = (req, res, next) => {
  const link = `${Url}/api/v1/users/sellers/verify`;
  signUp(Seller, sellerValidationSchema, link, req, res, next);
}

export const verifySeller = (req, res, next) => {
  verifyUser(Seller, req, res, next);
}

export const sellerSignIn = (req, res, next) => {
  signIn(Seller, req, res, next);
};

export const getSellers = (req, res, next) => {
  getUsers(Seller, req, res, next);
}

export const getSeller = (req, res, next) => {
  getUser(Seller, req, res, next);
}

export const updateSeller = (req, res, next) => {
  updateUser(Seller, req, res, next)
}

export const forgotPassword = (req, res, next) => {
  const link = `${Url}/api/v1/users/sellers/resetPassword`;

    userForgotPassword(Seller, link, req, res, next);
}

export const resetPassword = (req, res, next) => {
  userResetPassword(Seller, req, res, next)
}

export const changePassword = (req, res, next) => {
  userChangePassword(Seller, req, res, next);
}

export const deleteSeller = (req, res, next) => {
  deleteUser(Seller, req, res, next);
}

export const getProfile = (req, res, next) => {
  getUserProfile(Seller, req, res, next);
}

export const updateProfile = (req, res, next) => {
  updateUserProfile(Seller, req, res, next);
}

export const deleteMe = (req, res, next) => {
  deleteSelf(Seller, req, res, next);
}
