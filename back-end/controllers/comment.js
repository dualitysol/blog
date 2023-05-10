const CommentService = require("../services/comment.js");
const CommentModel = require("../models/comment");

const commentService = new CommentService(CommentModel, {});

const CommentController = {
  GetComments: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await commentService.GetCommentsByPost(postId);

      return res.status(200).json({ comments });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  CreateComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { name, message: content } = req.body;
      const message = await commentService.Create(postId, name, content);

      return res.status(201).json({
        message,
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },
};

module.exports = CommentController;
