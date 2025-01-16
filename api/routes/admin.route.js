import express from "express";
import {
  approveListing,
  deleteListing,
  deleteUser,
  getAllListings,
  getAllUsers,
  getListingsAdmin,
  getPendingListings,
  getUsersAdmin,
  pendListing,
  promoteUser,
  rejectListing,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../utils/isAdmin.js";

//Create router
const router = express.Router();

//Admin Router
router.get("/getAllUsers", isAdmin, getAllUsers);
router.get("/getUsers", isAdmin, getUsersAdmin);
router.get("/getAllListings", isAdmin, getAllListings);
router.get("/getListings", isAdmin, getListingsAdmin);
router.get("/getPendingListings", isAdmin, getPendingListings);
router.put("/approveListing/:id", isAdmin, approveListing);
router.put("/rejectListing/:id", isAdmin, rejectListing);
router.put("/pendListing/:id", isAdmin, pendListing);
router.delete("/deleteUser/:id", isAdmin, deleteUser);
router.put("/promoteUser/:id", isAdmin, promoteUser);
router.delete("/deleteListing/:id", isAdmin, deleteListing);

export default router;
