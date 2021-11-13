const {Joi} = require("express-validation");

const loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().required(),
    friends: Joi.array().items(Joi.object()).optional(),
    enemies: Joi.array().items(Joi.object()).optional(),
    photos: Joi.string(),
    bio: Joi.string().required(),
  })
};

modules.exports = loginValidation;