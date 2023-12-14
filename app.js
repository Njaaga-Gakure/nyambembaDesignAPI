require("dotenv").config();
require("express-async-errors");

const express = require("express");
const port = process.env.PORT || 3000;
const app = express();

// db
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// other pkgs
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// middlewares
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.use("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());
app.use(cors());

app.get("/", (req, res) => {
  res.send("home");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("home");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
