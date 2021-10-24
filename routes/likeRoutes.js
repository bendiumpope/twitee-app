import { Router } from "express";
import { createLike, getPostLikes } from "../controllers/likeController";


import { protect } from "../middle-wares/auth-middleware";

import User from "../models/userModel";

const router = Router();

router.use(protect(User));

router.post("/:postId", createLike);
router.get("/:postId", getPostLikes);

export default router;
