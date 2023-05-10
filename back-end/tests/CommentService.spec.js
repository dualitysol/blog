const CommentService = require("../services/comment");

const mockModel = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe("CommentService", () => {
  const commentService = new CommentService(mockModel);

  test("Create", async () => {
    const msg = await commentService.Create(1, "name", "bla");

    expect(msg).toBe("Comment added to the Post successfully!");
    expect(mockModel.create.mock.calls).toHaveLength(1);
    expect(mockModel.create.mock.calls[0][0]).toEqual({
      postId: 1,
      name: "name",
      message: "bla",
    });
  })

  test("GetCommentsByPost", async () => {
    const testComments = ["test", "comments"];

    mockModel.findAll.mockReturnValue(testComments);

    const comments = await commentService.GetCommentsByPost("1");

    expect(comments).toBe(testComments);
    expect(mockModel.findAll.mock.calls).toHaveLength(1);
    expect(mockModel.findAll.mock.calls[0][0]).toEqual({
      where: { postId: 1 },
    });
  })
})
