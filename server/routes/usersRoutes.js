const express = require("express");
const {validate} = require("express-validation");
const auth = require("../middlewares/userMiddleware");

const loginValidation = require("../schemas/userSchema");
const {
  registerUser,
  loginUser,
  getUsers
} = require("../controllers/usersControllers");


const usersRoutes = express.Router();

usersRoutes.post("/register", registerUser)
usersRoutes.post("/login", validate(loginValidation), loginUser);
usersRoutes.get("/", auth, getUsers);


module.exports = usersRoutes;