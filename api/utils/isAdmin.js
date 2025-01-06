import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const isAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied cmm" });
    }
    req.user = user; // Lưu thông tin người dùng đã giải mã vào req
    next();
  });
};
