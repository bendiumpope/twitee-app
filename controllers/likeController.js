import Like from "../models/likeModel";
import Post from "../models/postModel";
import HttpError from "../utils/http-error";
import likeValidationSchema from "../utils/joiValidators/likeValidation";
import { userPostsAndLikes } from "../utils/utils";
import {
  createController,
  getAllDataController,
} from "./handlerFactory/commonHandlerFactory";

export const createLike = async (req, res, next) => {
  try {
    const haveUserLiked = await Like.find({ post: { $eq: req.params.postId }, user: { $eq: req.user._id } });

    if (
      haveUserLiked.length > 0 
    ) {
      return next(new HttpError(`You have already liked or disliked this post`, 403));
    }


    createController(Like, likeValidationSchema, "like", req, res, next);

  } catch (error) {
    return next(new HttpError('An error occure please try again', 500));
  }
};

export const getPostLikes = (req, res, next) => {
  let queryData = { post: { $eq: req.params.postId }, likeType:{$eq: req.query.likeType} };
  getAllDataController(Like, "like", queryData, res, next);
};

export const getPostWithLikes = async (req, res, next) => {
  try {
    let posts = await Post.find({});
    let likes = await Like.find({});

    let data = await userPostsAndLikes(posts, likes);
    
    res.status(200).json({
      message: "success.",
      data: data,
    });
  } catch (error) {
    return next(new HttpError("Fetching posts failed please try again later", 500));
  }
}

