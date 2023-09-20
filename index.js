const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Exercise = require("./models/Exercise");

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .get(async (_req, res) => {
    const users = await User.find();

    res.status(200).json(users);
  })
  .post(async (req, res) => {
    const { username } = req.body;
    try {
      const user = new User({ username });
      await user.save();

      res.status(201).json({ username: user.username, _id: user._id });
    } catch (error) {
      res.status(500).json(error);
    }
  });

app.route("/api/users/:_id/exercises").post(async (req, res) => {
  const { description, duration } = req.body;
  const { _id } = req.params;

  try {
    const user = await User.findById(_id);
    const { username } = user;

    const date = req.body.date ? new Date(req.body.date) : new Date();

    const exercise = await Exercise.create({
      description,
      duration,
      date,
      username,
    });

    res.status(201).json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
      _id: user._id,
    });
  } catch (ex) {
    res.status(500).json(ex);
  }
});

app.route("/api/users/:_id/logs").get(async (req, res) => {
  const { _id } = req.params;
  const from = req.query.from || new Date(0).toISOString().substring(0, 10);
  const to =
    req.query.to || new Date(Date.now()).toISOString().substring(0, 10);
  const limit = +req.query.limit || 0;

  try {
    const user = await User.findById(_id);
    const exercises = await Exercise.find({
      username: user.username,
      date: { $gte: from, $lte: to },
    })
      .select("description duration date")
      .limit(limit);

    const log = exercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: new Date(ex.date).toDateString(),
    }));

    res.status(200).json({
      _id: user._id,
      username: user.username,
      log,
      count: exercises.length,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(PORT || 3000, () =>
  console.log("Your app is listening on port " + PORT)
);
