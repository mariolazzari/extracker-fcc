const { Schema, model } = require("mongoose");

const ExerciseSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Exercise = model("Exercise", ExerciseSchema);

module.exports = Exercise;
