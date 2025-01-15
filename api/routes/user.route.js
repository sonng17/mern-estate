import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListings,
  getUser,
  getMyUserListings,
  getMyUserListing,
  getMyUserNotifications,
  MarkAsRead,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

//Create router
const router = express.Router();

//User Router
router.get("/get/:id", getUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/mylistings/:id", verifyToken, getMyUserListings);
router.get("/mynotifications/:id", verifyToken, getMyUserNotifications);
router.put("/mark-as-read/:id", verifyToken, MarkAsRead);
router.get("/mylisting/:id", verifyToken, getMyUserListing);
router.get("/listings/:id", getUserListings);

export default router;
