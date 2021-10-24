import Comment from "../models/commentModel";
import HttpError from "../utils/http-error";
import commentValidationSchema from "../utils/joiValidators/commentValidation";
import { createController, deleteDataController, getAllDataController, updateDataController } from "./handlerFactory/commonHandlerFactory";

export const createComment = (req, res, next) => {
    createController(Comment, commentValidationSchema, 'comment', req, res, next);
}

export const getComments = (req, res, next) => {
    let queryData = { post: { $eq: req.params.postId } };
    getAllDataController(Comment, 'comment' , queryData, res, next);
}

export const updateComment = (req, res, next) => {
    const { commentId} = req.params;
    updateDataController(Comment, commentId, 'comment', req, res, next)
}

export const deleteComment = (req, res, next) => {
  const {commentId} = req.params
    deleteDataController(Comment, commentId, 'comment', req, res, next);
}