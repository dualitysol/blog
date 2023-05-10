const PostService = require("../services/post");
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const UserService = require("../services/user");

const userService = new UserService(UserModel, {});
const postService = new PostService(PostModel, { userService });

const PostController = {
  GetAllPosts: async (req, res) => {
    try {
      const posts = await postService.GetPosts();

      return res.status(200).json({
        posts,
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  GetPostsByUser: async (req, res) => {
    try {
      const { userId } = req.query;
      const posts = await postService.GetPostsByUserId(userId);

      return res.status(200).json({
        posts,
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  Create: async (req, res) => {
    try {
      const userId = req.userData.id;
      const { title, content, description } = req.body;
      const media = !!req.file && req.file.path;

      await postService.CreatePost({
        authorId: userId,
        title,
        content,
        description,
        media,
      });

      return res.status(201).json({
        message: "Blog Post posted successfully!",
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  GetPostById: async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await postService.GetPost(postId);

      return res.status(200).json(post);
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },
};

module.exports = PostController;
