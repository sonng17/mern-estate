import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use(express.json()); //cho phep json as input khi dung post de gui request, default thi server k cho phep nhan json

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//create middleware to handle request: normal middleware, handling error middleware (middlewares in expressjs)
//handling error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}); //tham so next de sang middleware tiep theo
