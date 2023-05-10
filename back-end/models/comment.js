"use strict";

const { DataTypes, Model } = require("sequelize");
const database = require("../database");

class Comment extends Model {}

Comment.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Posts",
        key: "id",
      },
    },
  },
  { sequelize: database }
);

Comment.sync({ force: true });

module.exports = Comment;
