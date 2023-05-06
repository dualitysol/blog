const UserModel = require("../models/user");
const UserService = require("../services/user");

const userService = new UserService(UserModel, null);

const UserController = {
  /**
   * This func creates new account by email and password
   */
  SignUp: async (req, res) => {
    try {
      const { userData, token } = await userService.CreateAccount(
        req.body.username,
        req.body.email,
        req.body.password
      );

      return res.status(201).json({
        message: "Account has been registered succesfully",
        token,
        userData,
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  SignIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { userData, token } = await userService.Authenticate(
        username,
        password
      );

      return res.status(200).json({
        message: "Auth successful!",
        token,
        userData,
      });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },
};

module.exports = UserController;
