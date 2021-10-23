import { Router } from "express";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/postControllers";
import { protect } from "../middle-wares/auth-middleware";

import User from "../models/userModel";

const router = Router();

router.use(protect(User));
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:postId", getPost);
router.patch("/:postId", updatePost);
router.delete("/:postId", deletePost);

export default router;
