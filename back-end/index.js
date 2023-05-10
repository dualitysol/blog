require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const {
  cors: corsMiddleware,
  notFoundException,
  internalException,
} = require("./middleware/common");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const port = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(corsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/", (req, res) => {
  res.status(200).json({ hello: "world" });
});
app.use(notFoundException);
app.use(internalException);

app.listen(port);
