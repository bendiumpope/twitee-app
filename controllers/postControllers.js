import Post from "../models/postModel";
import HttpError from "../utils/http-error";
import postValidationSchema from "../utils/joiValidators/postValidation";
import {
  createController,
  getAllDataController,
  getDataController,
  updateDataController,
} from "./handlerFactory/commonHandlerFactory";

export const createPost = (req, res, next) => {
  createController(Post, postValidationSchema, "post", req, res, next);
};

export const getPosts = (req, res, next) => {
  getAllDataController(Post, "post", {}, res, next);
};

export const getPost = (req, res, next) => {
  const { postId: dataId } = req.params;
  getDataController(Post, dataId, "post", res, next);
};

export const updatePost = (req, res, next) => {
  const { postId: dataId } = req.params;
  updateDataController(Post, dataId, "post", req, res, next);
};

export const deletePost = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const {postId} = req.params
    const post = await Post.findById(postId);
    console.log(post)
    if (post.user._id.toString() !== id.toString()) {
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );
    }

    const deletedPost = await Post.findByIdAndDelete(postId);
    // const deletedComments = await Comment.delle

    if (!deletedPost) {
      return next(
        new HttpError(`No post found with the provided ID`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new HttpError("Deleting post failed", 500));
  }
};
