import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/commentController";

import { protect } from "../middle-wares/auth-middleware";

import User from "../models/userModel";

const router = Router();

router.use(protect(User));

router.post("/:postId", createComment);
router.get("/:postId", getComments);
router.patch("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
