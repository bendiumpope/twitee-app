import Like from "../models/likeModel";
import HttpError from "../utils/http-error";
import likeValidationSchema from "../utils/joiValidators/likeValidation";
import {
  createController,
  getAllDataController,
} from "./handlerFactory/commonHandlerFactory";

export const createLike = async (req, res, next) => {
  try {
    const haveUserLiked = await Like.find({ user: { $eq: req.user._id } });

    if (haveUserLiked.length < 1) {
      createController(Like, likeValidationSchema, "like", req, res, next);
    }

    return next(new HttpError('you have already liked this post', 403));
  } catch (error) {
    return next(new HttpError('An error occure please try again', 500));
  }
};

export const getPostLikes = (req, res, next) => {
  let queryData = { post: { $eq: req.params.postId }, likeType:{$eq: req.query.likeType} };
  getAllDataController(Like, "like", queryData, res, next);
};

