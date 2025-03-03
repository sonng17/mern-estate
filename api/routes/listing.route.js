import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  getSameListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", verifyToken, getListing);
router.get("/get", getListings);
router.get("/get-same-listings/:id", getSameListings);

export default router;
