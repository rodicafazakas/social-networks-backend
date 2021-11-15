const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }, 
  friends: {
    type: [Types.ObjectId],
    ref: "Users",
    default: [],
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "Users",
    default: [],
  },
  photo: {
    type: String,
  },
  bio: {
    type: String,
    required: true,
  }
}); 

const User = model("User", userSchema, "Users"); 

module.exports = User;