import Comment from "../models/commentModel";
import Post from "../models/postModel";
import HttpError from "../utils/http-error";
import commentValidationSchema from "../utils/joiValidators/commentValidation";
import {
  createController,
  deleteDataController,
  getAllDataController,
  updateDataController,
} from "./handlerFactory/commonHandlerFactory";

export const createComment = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      return next(new HttpError("No post is associated with the provided postId"));
    }
    createController(
      Comment,
      commentValidationSchema,
      "comment",
      req,
      res,
      next
    );
  } catch (error) {
    return next(
      new HttpError("Something when wrong, please try again later", 500)
    );
  }
};

export const getComments = (req, res, next) => {
  let queryData = { post: { $eq: req.params.postId } };
  getAllDataController(Comment, "comment", queryData, res, next);
};

export const updateComment = (req, res, next) => {
  const { commentId } = req.params;
  updateDataController(Comment, commentId, "comment", req, res, next);
};

export const deleteComment = (req, res, next) => {
  const { commentId } = req.params;
  deleteDataController(Comment, commentId, "comment", req, res, next);
};
