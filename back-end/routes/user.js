const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const AuthGuard = require("../middleware/auth");
const ResetGuard = require("../middleware/reset");

router.post("/signup", UserController.SignUp);

router.post("/signin", UserController.SignIn);

router.post("/forgot-password", UserController.ForgotPassword);

router.post("/reset-password", ResetGuard, UserController.ResetPassword);

router.get("/:userId", AuthGuard, UserController.GetUserById);

router.patch("/:userId", AuthGuard, UserController.UpdateInfo);

module.exports = router;
