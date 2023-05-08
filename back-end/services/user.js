const jwt = require("jsonwebtoken");

/**
 * @throws { Error } if user has no id which means it does not exist
 */
const checkUserExists = (user) => {
  if (!!user === false || !!user.id === false) {
    const err = new Error("No account with that email address exists.");

    err.status = 404;

    throw err;
  }
};

/**
 * @throws { Error } if fgender is not equal to "male", "female", or null
 */
const validateGender = (gender = "") => {
  if (!!gender !== false && gender !== "Male" && gender !== "Female") {
    const err = new Error('Gender could be oly "male" or "female"!');

    err.status = 400;

    throw err;
  }
};

const validateAge = (age) => {
  try {
    if (!Number.isInteger(parseInt(age))) {
      throw new Error();
    }
    return;
  } catch (error) {
    const err = new Error("Age could be only an interger!");

    err.status = 400;

    throw err;
  }
};

class UserService {
  constructor(model, services) {
    this.model = model;
    this.services = services;
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

  /**
   * @param { String } email of user to reset password
   */
  async ForgotPassword(email) {
    const filter = { where: { email } };
    const user = !!email && (await this.model.findOne(filter));

    if ((!!user && !!user.id) === false) {
      const err = new Error("No account with that email address exists.");

      err.status = 404;

      throw err;
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      reset: true,
    };
    const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "5m" });
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

    try {
      await this.services.mailService.sendResetUrl(user.email, resetUrl);
    } catch (error) {
      throw new Error("Cannot sent reset password link to the email");
    }

    return "Reset password link was successfully sent.";
  }

  async UpdatePassword(userId, password) {
    const filter = { where: { id: userId } };
    const user = !!userId && (await this.model.findOne(filter));

    checkUserExists(user);

    const successful = await user.update({ password });

    return !!successful;
  }

  /**
   * @param { String } firstName
   * @param { String } lastName
   * @param { Number } age
   * @param { Enum<String> } gender - "male" or "female" only
   * @param { String } address
   * @param { String } website
   * @return { Boolean }
   */
  async SaveAccountInfo({
    userId,
    firstName,
    lastName,
    age,
    gender,
    address,
    website,
  }) {
    const filter = { where: { id: userId } };
    const user = !!userId && (await this.model.findOne(filter));

    checkUserExists(user);
    validateGender(gender);
    validateAge(age);

    const successful = await user.update({
      firstName,
      lastName,
      age: parseInt(age),
      gender,
      address,
      website,
    });

    return !!successful;
  }

  async GetAccount(userId) {
    const attributes = { exclude: ["password"] };
    const filter = { where: { id: userId }, attributes };
    const user = !!userId && (await this.model.findOne(filter));

    checkUserExists(user);

    return user;
  }
}

module.exports = UserService;
