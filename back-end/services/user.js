const jwt = require("jsonwebtoken");

class UserService {
  constructor(model, logger) {
    this.model = model;
    this.logger = logger;
  }

  /**
   * This func creates new account by email and password
   * @param { String } username
   * @param { String } email
   * @param { String } password
   * @returns { userData: { id: Number, email: String }, token: String }
   */
  async CreateAccount(username, email, password) {
    const { dataValues: user } = await this.model.create({ username, email, password });
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(userData, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    return { userData, token };
  }
}

module.exports = UserService;
