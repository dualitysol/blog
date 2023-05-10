class CommentService {
  constructor(model, services) {
    this.model = model;
    this.services = services;
  }

  async Create(postId, name, message) {
    await this.model.create({ name, message, postId });

    return "Comment added to the Post successfully!";
  }

  async GetCommentsByPost(postId) {
    const filter = { where: { postId: parseInt(postId) } };
    const comments = await this.model.findAll(filter);

    return comments;
  }
}

module.exports = CommentService;
