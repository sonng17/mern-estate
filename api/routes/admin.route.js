import express from "express";
import {
  approveListing,
  getAllUsers,
  getPendingListings,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../utils/isAdmin.js";
import { deleteUser } from "../controllers/user.controller.js";

//Create router
const router = express.Router();

//Admin Router
router.get("/getAllUsers", isAdmin, getAllUsers);
router.get("/getPendingListings", isAdmin, getPendingListings);
router.put("/approveListing/:id", isAdmin, approveListing);
router.delete("/delete/:id", isAdmin, deleteUser);

export default router;
