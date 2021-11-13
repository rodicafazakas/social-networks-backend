const bcrypt = require("bcrypt");
const { JsonWebTokenError } = require("jsonwebtoken");

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

    const rightPassword = await bcrypt(password, user.password);
    if (rightPassword) {
      const token = JsonWebTokenError.sign({username}, process.env.JWT_SECRET);
      res.json({token});
    } else {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Authentification problem";
  }
};

module.exports = {registerUser, loginUser};