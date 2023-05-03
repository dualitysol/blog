"use strict";

const { DataTypes, Model } = require("sequelize");
const { hash } = require("bcrypt");
const database = require("../database");

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username is required",
        },
      },
      unique: {
        args: true,
        msg: "This username already in use!",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Email is required",
        },
        isEmail: {
          args: true,
          msg: "Email should be valid",
        },
      },
      unique: {
        args: true,
        msg: "Email address already in use!",
      },
    },
    password: {
      type: DataTypes.STRING,
      async set(value) {
        if (!!value === false) return;
        this.setDataValue("password", await hash(value, 10));
      },
    },
  },
  { sequelize: database }
);

User.sync({ force: true });

module.exports = User;
