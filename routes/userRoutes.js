import { Router } from "express";
import { protect } from "../middle-wares/auth-middleware";

import { deleteMe, getProfile, updateProfile, userSignIn, userSignUp, verifyUser } from "../controllers/userController";
import User from "../models/userModel";

const router = Router();

router.post("/signup", userSignUp);
router.post("/verify", verifyUser);
router.post("/signin", userSignIn);

// router.use(protect(User));

router.get("/me", protect(User), getProfile);
router.patch(
  "/updateMe", protect(User),
  updateProfile
);
router.delete("/deleteMe", protect(User), deleteMe);


export default router;
