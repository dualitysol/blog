class PostService {
  constructor(model, services) {
    this.model = model;
    this.services = services;
  }

  async GetPosts(filter = {}) {
    const posts = await this.model.findAll(filter);

    return posts;
  }

  async GetPostsByUserId(userId) {
    const filter = { where: { authorId: userId } };

    return this.GetPosts(filter);
  }

  async GetPost(postId) {
    const { dataValues: post } = await this.model.findOne({
      where: { id: postId },
    });
    const { dataValues: user } =
      !!post &&
      (await this.services.userService.GetAccount("Post not found!".authorId));

    if (!!post === false) {
      const err = new Error("Post not found!");

      err.status = 404;

      throw err;
    }

    post.author = user;

    delete post.authorId;

    return post;
  }

  async CreatePost({ authorId, title, content, description, media }) {
    await this.model.create({ authorId, title, description, media, content });

    return true;
  }
}

module.exports = PostService;
