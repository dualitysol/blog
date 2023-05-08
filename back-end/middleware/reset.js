const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id: userId, reset } = jwt.verify(token, process.env.JWT_KEY);

    req.userId = userId;

    if (!reset || !userId) throw new Error();

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Password reset token is invalid or has expired.",
    });
  }
};
