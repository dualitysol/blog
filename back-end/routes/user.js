const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/signup", UserController.SignUp);

router.post("/signin", UserController.SignIn);

router.post("/forgot-password", UserController.ForgotPassword);

module.exports = router;
