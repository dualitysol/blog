const UserService = require("../services/user");
const jwt = require("jsonwebtoken");

const testEmail = "user@example.com";
const testUsername = "example";
const testPassword = "testPassword";
const testToken = "testToken";

const mockedComparePassword = jest.fn((password) => {
  return password === testPassword;
});

class MockUser {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  comparePassword(password) {
    return mockedComparePassword(password);
  }
};

const mockModel = {
  create: jest.fn(({ username, email, password }) => {
    if (!!username && !!email && !!password) {
      return {
        dataValues: {
          id: 1,
          username,
          email,
        },
      };
    }

    throw new Error("Test error message!");
  }),

  findOne: jest.fn(({ where: filter }) => {
    if (!filter) {
      throw new Error("Provide filter to search!");
    }
    
    const user = new MockUser(1, testUsername, testEmail, testPassword);
    const usernameProvided = !!filter.username === true;
    const userExists = filter.username === user.username;

    if (usernameProvided && userExists) {
      return user;
    }

    return null;
  })
};

const mockMailService = {
  sendResetUrl: jest.fn(),
};

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => testToken),
}));

describe("User Service", () => {
  const userService = new UserService(mockModel, { mailService: mockMailService });

  describe("Create Account", () => {
    test("Creates account with provided email and password", async () => {
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
      expect(token).toBe(testToken);
      expect(jwt.sign.mock.calls).toHaveLength(1);
      expect(jwt.sign.mock.calls[0][0]).toEqual(testUserData);
      expect(jwt.sign.mock.calls[0][1]).toBe(process.env.JWT_KEY);
      expect(jwt.sign.mock.calls[0][2]).toEqual({ expiresIn: "1h" });
    });

    test("Throws error if email is not provided", async () => {
      try {
        await userService.CreateAccount("example", null, "password");
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
      try {
        await userService.CreateAccount(null, "user@example.com", "password");
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
      try {
        await userService.CreateAccount("example", "user@example.com", null);
      } catch (error) {
        expect(error.message).toBe("Test error message!");
        expect(jwt.sign.mock.calls).toHaveLength(1);
      }
    });
  });

  describe("Authenticate", () => {
    test("Authenticates user if payload is correct", async () => {
      const { userData, token } = await userService.Authenticate(testUsername, testPassword);
      const testUserData = {
        id: 1,
        username: testUsername,
        email: testEmail,
      };

      expect(userData.id).toBe(1);
      expect(userData.email).toBe(testEmail);
      expect(userData.username).toBe(testUsername);
      expect(token).toBe(testToken);
      expect(jwt.sign.mock.calls).toHaveLength(2);
      expect(jwt.sign.mock.calls[0][0]).toEqual(testUserData);
      expect(jwt.sign.mock.calls[1][1]).toBe(process.env.JWT_KEY);
      expect(jwt.sign.mock.calls[1][2]).toEqual({ expiresIn: "1h" });
    })

    test("Throws error if payload is incorrect", async () => {
      try {
        await userService.Authenticate(testUsername, "Slava Ukraini");
      } catch ({ message, status }) {
        expect(jwt.sign.mock.calls).toHaveLength(2);
        expect(message).toBe("Invalid username/password, Try again!");
        expect(status).toBe(401);
      }

      try {
        await userService.Authenticate("wrongUsername", testPassword);
      } catch ({ message, status }) {
        expect(jwt.sign.mock.calls).toHaveLength(2);
        expect(message).toBe("Invalid username/password, Try again!");
        expect(status).toBe(401);
      }
    })
  })

  describe("ForgotPassword", () => {
    test("Sends reset password link to email if user exists", async () => {
      mockModel.findOne.mockReturnValueOnce(new MockUser(1, testUsername, testEmail, testPassword));
      await userService.ForgotPassword(testEmail);

      const testUserData = {
        id: 1,
        username: testUsername,
        email: testEmail,
        reset: true,
      };
      const testUrl = `${process.env.BASE_URL}/reset-password?token=${testToken}`;

      expect(jwt.sign.mock.calls).toHaveLength(3);
      expect(jwt.sign.mock.calls[2][0]).toEqual(testUserData);
      expect(jwt.sign.mock.calls[2][1]).toBe(process.env.JWT_KEY);
      expect(jwt.sign.mock.calls[2][2]).toEqual({ expiresIn: "5m" });
      expect(mockMailService.sendResetUrl.mock.calls).toHaveLength(1);
      expect(mockMailService.sendResetUrl.mock.calls[0][0]).toEqual(testEmail);
      expect(mockMailService.sendResetUrl.mock.calls[0][1]).toEqual(testUrl);
    })

    test("Throws error if user does not exist", async () => {
      mockModel.findOne.mockReturnValueOnce(null);
      try {
        await userService.ForgotPassword(testEmail);
      } catch ({ message, status }) {
        expect(message).toBe("No account with that email address exists.");
        expect(status).toBe(404);
      }
    })
  })
});
