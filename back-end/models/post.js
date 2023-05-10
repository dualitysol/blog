"use strict";

const { DataTypes, Model } = require("sequelize");
const database = require("../database");

class Post extends Model {}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title is required",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Content is required",
        },
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    media: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize: database }
);

Post.sync({ force: true });

module.exports = Post;
