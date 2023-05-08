"use strict";

const { DataTypes, Model } = require("sequelize");
const { hash, compare } = require("bcrypt");
const database = require("../database");

class User extends Model {
  /**
   * @param { String } value - password received from the front-end to auth the user
   * @returns { Boolean } is hash of the provided password mathces with pass in DB
   */
  async comparePassword(password = "rand pass") {
    return compare(password, this.password);
  }

  /**
   * @param { String } username
   * @param { String } email
   * @param { String } password
   *
   * @override password as hash of the provided password
   */
  static async create(payload) {
    if (payload.password) {
      payload.password = await hash(payload.password, 10);
    }

    return super.create(payload);
  }

  async update(payload) {
    if (payload.password) {
      payload.password = await hash(payload.password, 10);
    }

    return super.update(payload);
  }
}

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
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password is required",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize: database }
);

User.sync({ force: true });

module.exports = User;
