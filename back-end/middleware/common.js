module.exports = {
  cors: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, GET, DELETE"
      );
      return res.status(200).json({});
    }
    next();
  },

  notFoundException: (req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  },

  internalException: (error, req, res) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  },
};
