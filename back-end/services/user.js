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
    const { dataValues: user } = await this.model.create({
      username,
      email,
      password,
    });
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

  /**
   * This method logs in the user by comparing hashed passwords
   * @param { String } username
   * @param { String } password
   * @returns { String } JWT Token with user data
   */
  async Authenticate(username, password) {
    const filter = { where: { username } };
    const user = await this.model.findOne(filter);
    const isPassCorrect = !!user && (await user.comparePassword(password));

    if (isPassCorrect === false) {
      const err = new Error("Invalid username/password, Try again!");

      err.status = 401;

      throw err;
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "1h" });

    return { userData, token };
  }
}

module.exports = UserService;
