const debug = require("debug")("file:server:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({error: "Page not found"});
}; 

const generalErrorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Validation error";
  }
  debug(chalk.red("An error has ocurred"), chalk.red(error.message));
  res.status(error.code || 500).json({error: error.message ?? "An error has ocurred."});
}

module.exports = {notFoundErrorHandler, generalErrorHandler};