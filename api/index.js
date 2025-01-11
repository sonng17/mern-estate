import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import path from "path";
import cors from "cors";

//Connect db, config .env
dotenv.config(); //config env
mongoose
  .connect(process.env.MONGO) //đơn giản là connect thôi
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  }); //

//Create Server
const __dirname = path.resolve();

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// Cấu hình CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-estate-web.vercel.app"], // Thay bằng domain của frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Các method được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
  })
);

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//

//Create middleware to handle request: normal middleware, handling error middleware
app.use(express.json()); //Auto phải có, để client gửi json as input khi dung post,get,... khi gui request, default server k cho phep nhan json
app.use(cookieParser());
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//-handling error middleware
app.use((err, req, res, next) => {
  //tham so next de sang middleware tiep theo neu dung
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}); ////
