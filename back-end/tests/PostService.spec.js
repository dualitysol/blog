const PostService = require("../services/post");

const testEmail = "user@example.com";
const testUsername = "example";
const testId = 1;

const mockModel = {
  create: jest.fn(),

  findOne: jest.fn(),

  findAll: jest.fn(),
};

const mockUserService = {
  GetAccount: jest.fn(() => ({
    dataValues: {
      id: testId,
      username: testUsername,
      email: testEmail,
    }
  }))
};

describe("PostService", () => {
  const postService = new PostService(mockModel, { userService: mockUserService });

  test("GetPosts", async () => {
    const testPosts = [{ id: 1 }, { id: 2 }];

    mockModel.findAll.mockReturnValue(testPosts);

    const posts = await postService.GetPosts();

    expect(posts).toBe(testPosts);
  })

  test("CreatePost", async () => {
    mockModel.create.mockReturnValue(true);

    const success = await postService.CreatePost({
      authorId: 1,
      title: "t",
      content: "c",
      description: "d",
      media: "m"
    });

    expect(success).toBe(true);
    expect(mockModel.create.mock.calls).toHaveLength(1);
    expect(mockModel.create.mock.calls[0][0]).toEqual({
      authorId: 1,
      title: "t",
      content: "c",
      description: "d",
      media: "m"
    });
  })

  describe("GetPost", () => {
    test("Returns post", async () => {
      mockModel.findOne.mockReturnValue({
        dataValues: {
          authorId: 1,
          title: "t",
          content: "c",
          description: "d",
          media: "m"
        }
      });

      const post = await postService.GetPost(1);

      expect(post).toStrictEqual({
        title: "t",
        content: "c",
        description: "d",
        media: "m",
        author: {
          id: testId,
          username: testUsername,
          email: testEmail,
        },
      });
      expect(mockModel.findOne.mock.calls).toHaveLength(1);
      expect(mockModel.findOne.mock.calls[0][0]).toEqual({
        where: { id: 1 },
      });
    })

    test("Throws 404 if post not found", async () => {
      try {
        mockModel.findOne.mockReturnValue({ dataValues: null });

        await postService.GetPost(1);
      } catch ({ message, status }) {
        expect(message).toBe("Post not found!");
        expect(status).toBe(404);
      }
    })
  })
})
