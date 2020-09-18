const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./db/mongo");
const userRouter = require("./routers/userRouter");
const urlRouter = require("./routers/urlRouter");
const URL = require("./models/URL");

const app = express();

//Loading confing file in development mode
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

//connecting DB
connectDB();

//Express Middlewares
app.use(express.json());

//User sessions
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//logger and helmet for security
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

//userroutes and urlroutes
app.use(userRouter);
app.use(urlRouter);

//redirect url
app.get("/:id", async (req, res) => {
  try {
    const url = await URL.findOne({ slug: req.params.id });
    if (!url) {
      throw new Error("URL not found...!");
    }

    res.redirect(url.longUrl);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(
  process.env.PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);
