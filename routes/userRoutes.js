import { Router } from "express";
import { protect } from "../middle-wares/auth-middleware";

import { deleteMe, getProfile, updateProfile, userSignIn, userSignUp, verifyUser } from "../controllers/userController";
import User from "../models/userModel";

const router = Router();

router.post("/signup", userSignUp);
router.get("/verify", verifyUser);
router.post("/signin", userSignIn);

router.use(protect(User));

router.get("/me", getProfile);
router.patch(
  "/updateMe",
  updateProfile
);
router.delete("/deleteMe", deleteMe);


export default router;
