const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/signup", UserController.SignUp);

router.post("/signin", UserController.SignIn);

module.exports = router;
