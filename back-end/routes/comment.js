const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment");
const AuthGuard = require("../middleware/auth");

router.get("/:postId", AuthGuard, CommentController.GetComments);

router.post("/:postId", AuthGuard, CommentController.CreateComment);

module.exports = router;
