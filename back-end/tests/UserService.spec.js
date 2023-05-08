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
  }),

  describe("GetAccount", () => {
    test("Successfully getting account data", async () => {
      mockModel.findOne.mockReturnValueOnce({
        id: 3,
        username: testUsername,
        email: testEmail,
      });

      const user = await userService.GetAccount(3);

      expect(user.id).toBe(3);
      expect(user.email).toBe(testEmail);
      expect(user.username).toBe(testUsername);
      expect(mockModel.findOne.mock.calls).toHaveLength(6);
      expect(mockModel.findOne.mock.calls[5][0]).toEqual({
        where: { id: 3 },
        attributes: { exclude: ["password"] },
      });
    });

    test("Throws error if user does not exist", async () => {
      mockModel.findOne.mockReturnValueOnce(null);

      try {
        await userService.GetAccount(1);
      } catch ({ message, status }) {        
        expect(mockModel.findOne.mock.calls).toHaveLength(7);
        expect(mockModel.findOne.mock.calls[6][0]).toEqual({
          where: { id: 1 },
          attributes: { exclude: ["password"] },
        });
        expect(message).toBe("No account with that email address exists.");
        expect(status).toBe(404);
      }
    })
  }),

  describe("SaveAccountInfo", () => {
    test("Successfull saving info", async () => {
      const mockUpdate = jest.fn(() => 1);
      mockModel.findOne.mockReturnValueOnce({
        id: 4,
        username: testUsername,
        email: testEmail,
        update: mockUpdate,
      });

      const successful = await userService.SaveAccountInfo({
        userId: 4,
        firstName: "firstName",
        lastName: "lastName",
        age: "18",
        gender: "Male",
        address: "Ukraine",
        website: "google.com",
      });

      expect(successful).toBe(true);
      expect(mockModel.findOne.mock.calls).toHaveLength(8);
      expect(mockModel.findOne.mock.calls[7][0]).toEqual({
        where: { id: 4 },
      });
      expect(mockUpdate.mock.calls).toHaveLength(1);
      expect(mockUpdate.mock.calls[0][0]).toEqual({
        firstName: "firstName",
        lastName: "lastName",
        age: 18,
        gender: "Male",
        address: "Ukraine",
        website: "google.com",
      });
    });

    test("Throws if gender is incorrect", async () => {
      mockModel.findOne.mockReturnValueOnce({
        id: 4,
        username: testUsername,
        email: testEmail,
      });

      try {
        await userService.SaveAccountInfo({
          userId: 4,
          firstName: "firstName",
          lastName: "lastName",
          age: "18",
          gender: "Bi-gender",
          address: "Ukraine",
          website: "google.com",
        });
      } catch ({ message }) {
        expect(message).toBe('Gender could be oly "male" or "female"!');
      }
    });

    test("Throws if age is not a number", async () => {
      mockModel.findOne.mockReturnValueOnce({
        id: 5,
        username: testUsername,
        email: testEmail,
      });

      try {
        await userService.SaveAccountInfo({
          userId: 5,
          firstName: "firstName",
          lastName: "lastName",
          age: "twenyone",
          gender: "Male",
          address: "Ukraine",
          website: "google.com",
        });
      } catch ({ message, status }) {
        expect(message).toBe("Age could be only an interger!");
        expect(status).toBe(400);
      }
    });
  })

  describe("UpdatePassword", () => {
    test("Updated password", async () => {
      const mockUpdate = jest.fn(() => 1);

      mockModel.findOne.mockReturnValueOnce({
        id: 4,
        update: mockUpdate,
      });

      const succesfull = await userService.UpdatePassword(4, "password");

      expect(succesfull).toBe(true);
      expect(mockUpdate.mock.calls).toHaveLength(1);
      expect(mockUpdate.mock.calls[0][0]).toEqual({ password: "password" });
    });

    test("Throws is user does not exist", async () => {
      mockModel.findOne.mockReturnValueOnce(null);

      try {
        await userService.UpdatePassword(4, "password");
      } catch ({ message, status }) {
        expect(message).toBe("No account with that email address exists.");
        expect(status).toBe(404);
      }
    });
  })
});
