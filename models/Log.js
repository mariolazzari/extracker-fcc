const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  log: {
    type: [],
  },
});

const User = model("User", UserSchema);

module.exports = User;
