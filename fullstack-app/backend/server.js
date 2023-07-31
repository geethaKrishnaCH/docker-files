const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const winston = require("winston");
const cors = require("cors");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (log) => `${log.timestamp} ${log.level.toUpperCase()} ${log.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

const app = express();
app.use(cors());
app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});
app.use(bodyParser.json());

const Goal = mongoose.model("Goal", {
  description: String,
});

async function connectToDB() {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@goals-mongodb:27017/goals-db?authSource=admin`
    );
    console.log("Connected to Mongo Server");
    app.listen(process.env.PORT || 8080);
  } catch (err) {
    console.log("Failed to connect to Mongo Server");
    console.error(err);
  }
}

connectToDB();

app.get("/goal", async (req, res) => {
  const goals = await Goal.find();
  return res.status(200).send(goals);
});

app.post("/goal", async (req, res) => {
  const description = req.body.description;
  if (!description.trim())
    return res.status(400).send({ message: "Invalid description for goal" });
  const goal = new Goal({ description });
  await goal.save();
  return res.status(202).send(goal);
});
