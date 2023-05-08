const UserModel = require("../models/user");
const MailService = require("../services/mail");
const UserService = require("../services/user");

const mailService = new MailService(
  process.env.MAIL_HOST,
  process.env.MAIL_USER,
  process.env.MAIL_PASS
);
const services = { mailService };
const userService = new UserService(UserModel, services);

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

  ForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const message = await userService.ForgotPassword(email);

      return res.status(200).json({ message });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  UpdateInfo: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const canUpdate = req.userData.id === userId;
      const result = canUpdate && await userService.SaveAccountInfo({
        userId: req.userData.id,
        ...req.body,
      });

      if (!result) {
        const error = new Error("Error while updating account info");

        if (!canUpdate) {
          error.message = "You can update only your account";
          error.status = 401;
        }

        throw error;
      }

      return res.status(200).json({ message: "Profile updated successfully!" });
    } catch ({ message, status }) {
      return res.status(status || 500).json({ message });
    }
  },

  GetUserById: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = !!userId && (await userService.GetAccount(userId));

      if (!user) {
        const error = new Error("Invalid userId, Try again!");

        error.status = 400;

        throw error;
      }

      return res.status(200).json(user);
    } catch ({ message, status }) {
      return res.status(500).json({ message });
    }
  },
};

module.exports = UserController;
