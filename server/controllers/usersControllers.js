const bcrypt = require("bcrypt");
const debug = require("debug")("file:controllers:usersControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    error.code = 400;
    error.message = "User registration failed";
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username});

    const rightPassword = await bcrypt.compare(password, user.password);
    console.log(rightPassword);
    if (rightPassword) {
      const token = jwt.sign({username}, process.env.JWT_SECRET);
      res.json({token});
    } else {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Authentification problem";
    next(error);
  }
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
}

module.exports = {registerUser, loginUser, getUsers};