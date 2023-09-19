const { Schema, model } = require("mongoose");

const LogSchema = new Schema({
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

const Log = model("Log", LogSchema);

module.exports = Log;
