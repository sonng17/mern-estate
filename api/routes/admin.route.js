import express from "express";
import {
  approveListing,
  deleteListing,
  deleteUser,
  getAllListings,
  getAllUsers,
  getPendingListings,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../utils/isAdmin.js";

//Create router
const router = express.Router();

//Admin Router
router.get("/getAllUsers", isAdmin, getAllUsers);
router.get("/getAllListings", isAdmin, getAllListings);
router.get("/getPendingListings", isAdmin, getPendingListings);
router.put("/approveListing/:id", isAdmin, approveListing);
router.delete("/deleteUser/:id", isAdmin, deleteUser);
router.delete("/deleteListing/:id", isAdmin, deleteListing);


export default router;
