require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authenticateUser = require("./middleware/authentication");
const User = require("./models/User");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authrouter = require("./routes/auth");
const jobsrouter = require("./routes/jobs");
const connectDB = require("./db/connect");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("jobs api");
});
// routes

app.get("/api/v1/users", async (req, res) => {
  const user = await User.find({});
  res.status(200).json({ user });
});
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/jobs", authenticateUser, jobsrouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
