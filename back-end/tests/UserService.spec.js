const UserService = require("../services/user");
const jwt = require("jsonwebtoken");

const mockModel = {
  create: jest.fn(({ username, email, password }) => {
    if (!!username && !!email && !!password) {
      return {
        dataValues: {
          id: 1,
          username,
          email
        }
      }
    }
    
    throw new Error("Test error message!");
  }),
};

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "testToken"),
}));

describe("User Service", () => {
  const userService = new UserService(mockModel, null);

  describe("Create Account", () => {
    test("Creates account with provided email and password", async () => {
      const testEmail = "user@example.com";
      const testUsername = "example";
      const testPassword = "testPassword";
      const testId = 1;
      const testUserData = {
        id: testId,
        username: testUsername,
        email: testEmail,
      };

      mockModel.create.mockReturnValueOnce({ dataValues: testUserData });

      const { userData, token } = await userService.CreateAccount(
        testUsername,
        testEmail,
        testPassword
      );

      expect(userData.id).toBe(testId);
      expect(userData.email).toBe(testEmail);
      expect(mockModel.create.mock.calls).toHaveLength(1);
      expect(mockModel.create.mock.calls[0][0]).toEqual({
        username: testUsername,
        email: testEmail,
        password: testPassword,
      });
      expect(token).toBe("testToken");
      expect(jwt.sign.mock.calls).toHaveLength(1);
      expect(jwt.sign.mock.calls[0][0]).toEqual(testUserData);
      expect(jwt.sign.mock.calls[0][1]).toBe(process.env.JWT_KEY);
      expect(jwt.sign.mock.calls[0][2]).toEqual({ expiresIn: "1h" });
    });

    test("Throws error if email is not provided", async () => {
      try {
        await userService.CreateAccount("example", null, "password")
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
      try {
        await userService.CreateAccount(null, "user@example.com", "password")
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
      try {
        await userService.CreateAccount("example", "user@example.com", null)
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
    });
  });
});
