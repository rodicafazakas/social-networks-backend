const express = require("express");
const {validate} = require("express-validation");

const {registerUser, loginUser} = require("../controllers/usersControllers");
const loginValidation = require("../schemas/userSchema");

const usersRoutes = express.Router();

usersRoutes.post("/register", registerUser)
usersRoutes.post("/login", validate(loginValidation), loginUser);


module.exports = usersRoutes;