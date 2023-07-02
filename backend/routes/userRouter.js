import express from "express";

import {
  registerUser,
  verifyUserEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  redirectResetPassword,
  verifyResetPassword,
  resetPassword,

} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);

router.route("/verify/:token").get(verifyUserEmail);

router.route("/forgotpassword").post(forgotPassword);

router.route("/redirect-reset-password/:token").get(verifyResetPassword);

// router.route("/resetpassword/:token").put(resetPassword);

router.route("/resetpassword").put(resetPassword);

router.post("/login", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);





export default router;
