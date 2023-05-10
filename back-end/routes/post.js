const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post");
const AuthGuard = require("../middleware/auth");
const FilesUpload = require("../middleware/filesUpload");

router.get("/", AuthGuard, PostController.GetAllPosts);

router.post(
  "/",
  AuthGuard,
  FilesUpload.single("picture"),
  PostController.Create
);

router.get("/:postId", AuthGuard, PostController.GetPostById);

module.exports = router;
