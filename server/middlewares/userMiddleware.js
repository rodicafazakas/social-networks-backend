const debug = require("debug")("file:middlewares:userMiddleware");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    debug(chalk.red("Not authorized"));
    const error =  new Error("Not authorized");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Missing token");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        req.username = user.username;
        next();
      } catch (error) {
        debug(chalk.red(error));
        error.message = "Invalid token";
        error.code = 401;
        next(error);
      }
    }
  }
}

module.exports = auth; 