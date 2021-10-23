import bcrypt from "bcryptjs";

import HttpError from "../../utils/http-error";
import { decodeToken, generateToken } from "../../utils/jwt/Jwtoken";
import mailer from "../../utils/emailService/sendEmail";
import { filterObj } from "../../utils/utils";

const fromUser = process.env.GMAIL_USER;

export const signUp = async (Model, validatorSchema, link, req, res, next) => {
  try {
    const userRequest = { ...req.body };
    const { error } = await validatorSchema.validate(req.body);

    if (error) {
      return next(new HttpError(error.details[0].message, 404));
    }

    const isEmailUniq = await Model.findOne({ email: userRequest.email });

    if (isEmailUniq) {
      return next(
        new HttpError(`User with this ${userRequest.email} already exists`, 422)
      );
    }
    const passwordHash = await bcrypt.hash(userRequest.password, 8);
    userRequest.password = passwordHash;

    const newsecretToken = generateToken(userRequest);

    const html = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to Edes Store.</h2>
            <p>Congratulations! You're almost set to start using twitee App.
                Just click the button below to validate your email address.
            </p>

            <a href="${link}?secretToken=${newsecretToken}" style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Click here</a>

            <p>Or click the link below</p>

            <div>${link}?secretToken=${newsecretToken}</div>
        </div>`;

    // Send email
    await mailer.sendEmail(
      fromUser,
      userRequest.email,
      "Please verify your email!",
      html
    );

    res.status(201).json({
      message:
        "Registration Successful! an email have been sent to you for verification.",
      token: newsecretToken,
    });
  } catch (error) {
      return next(
      new HttpError("Could not register user, please try again.", 500)
    );
  }
};

export const verifyUserAccount = async (Model, req, res, next) => {
  try {
    const { secretToken } = req.query;

    let user;
    try {
      user = decodeToken(secretToken);
    } catch (error) {
      return next(new HttpError("Invalid token", 400));
    }

    const newUser = await new Model(user);
    await newUser.save();

      const newSecretToken = generateToken({ ...newUser });
      req.headers.authorization = `Bearer ${newSecretToken}`;

    res.status(200).json({
      message: "Verification is Successful Thank you! You may now login.",
      token: newSecretToken,
      data: newUser,
    });
  } catch (error) {
    const message = error.message || error;
    return next(new HttpError(`${message}`, 500));
  }
};

export const signIn = async (Model, req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Model.findOne({ email });

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!user || !validatePassword) {
      return next(new HttpError("Invalid credentials provided", 403));
    }

    const loginUser = { ...user };
    const token = generateToken(loginUser);

    req.headers.authorization = `Bearer ${token}`;


    return res.status(200).json({
      message: "Success",
      token: token,
    });
  } catch (err) {
    return next(new HttpError("Login user failed", 500));
  }
};

export const getUserProfile = async (Model, req, res, next) => {
  try {
    const { _id: id } = req.user;
    const user = await Model.findById(id, "-password");

    if (!user) {
      return next(new HttpError("Invalid user ID", 404));
    }
    res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    const err = new HttpError("Fetching user failed", 500);
    return next(err);
  }
};

export const updateUserProfile = async (Model, req, res, next) => {
  try {
    const { _id: id } = req.user;

    if (req.body.password) {
      return next(new HttpError("This route is not for password update.", 400));
    }

    const filteredBody = filterObj(req.body, "password");

    const updatedUser = await Model.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new HttpError("Invalid user ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    const err = new HttpError("Something went wrong.", 500);
    return next(err);
  }
};

export const deleteSelf = async (Model, req, res, next) => {
  try {
    const user = await Model.findByIdAndDelete(req.user._id);

    if (!user) {
      return next(new HttpError("No user found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new HttpError("Something went wrong.", 500));
  }
};
