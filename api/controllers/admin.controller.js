import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

//Admin controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "pending" });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
